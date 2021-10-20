import { ISocketIOController } from '../../infrastructure/socketIOController';
import {
    addNewRoomMemberEvent,
    fulfillRoomEvent,
} from '../../routes/socketEvents';
import { IUserRepository } from '../repositories/userRepository';
import { IRoomRepository } from '../repositories/roomRepository';
import { Room } from '../model/room';

interface IUserService {
    createRoom(socketId: string): Promise<Room>;
    join(socketId: string): Promise<Room>;
    leave(socketId: string): Promise<void>;
}

class UserService implements IUserService {
    socketController: ISocketIOController;
    userRepository: IUserRepository;
    roomRepository: IRoomRepository;

    constructor(
        socketController: ISocketIOController,
        userRepository: IUserRepository,
        roomRepository: IRoomRepository
    ) {
        this.socketController = socketController;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
    }

    async createRoom(socketId: string): Promise<Room> {
        const socket = this.socketController.getSocket(socketId);
        if (!socket) {
            throw 'socket idに対応するソケットが見つかりませんでした';
        }
        const user = this.userRepository.findUserWithSocketId(socketId);
        if (!user) {
            console.error('ユーザーがいません');
            throw 'ユーザーがいません';
        }
        const roomName = 'ルーム' + this.socketController.numberOfRooms();
        const room = new Room([user], roomName);
        await this.socketController.createRoom(roomName, socket);
        this.roomRepository.saveRoom(room);
        return room;
    }

    async join(socketId: string): Promise<Room> {
        const socket = this.socketController.getSocket(socketId);
        if (!socket) {
            // socketが見つからない
            throw 'socketが見つからない';
        }
        const user = this.userRepository.findUserWithSocketId(socketId);
        if (!user) {
            throw 'ユーザーが存在しません';
        }
        const room = this.roomRepository.getRoomFromUser(user);
        if (room) {
            throw '既にこのユーザーはルームに入っています';
        }
        const roomName = this.socketController.getAvailableRoomName();
        console.info(roomName);
        try {
            if (roomName) {
                // 利用可能な部屋がある場合
                console.log('利用可能な部屋あり');
                await this.socketController.joinRoom(roomName, socket);
                const room = this.roomRepository.getRoomFromName(roomName);
                if (!room) {
                    throw `${roomName}という名前のルームが存在しません`;
                }
                room.assignedUsers.push(user);
                this.roomRepository.saveRoom(room);
            } else {
                // 利用可能な部屋がない場合
                console.log('利用可能な部屋なし');
                console.log('ルームの新規作成');
                await this.createRoom(socketId);
            }
            const room = this.roomRepository.getRoomFromUser(user);
            if (!room) {
                throw 'ルームが存在しません';
            }
            this.socketController.sendToRoom(
                null,
                room.roomname,
                addNewRoomMemberEvent,
                [room]
            );

            const fulfill = room.assignedUsers.length == 2;
            console.log('fulfill', fulfill);
            if (fulfill) {
                this.socketController.sendToRoom(
                    null,
                    room.roomname,
                    fulfillRoomEvent,
                    [room]
                );
            }

            return room;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async leave(socketId: string): Promise<void> {
        const user = this.userRepository.findUserWithSocketId(socketId);
        if (!user) {
            throw 'ユーザーが存在しません';
        }
        const room = this.roomRepository.getRoomFromUser(user);
        if (!room) {
            throw 'ルームが存在しません';
        }
        if (room.currentGame) {
            // ゲームを強制終了して破棄
            room.currentGame.terminate();
            room.currentGame = null;
        }
        room.assignedUsers = room.assignedUsers.filter(
            (u) => u.socketId != socketId
        );
        console.log(`${socketId}のユーザを${room.roomname}から削除しました`);
        console.log(room);
        const socketRoom = this.socketController.findRoom(room.roomname);
        if (!socketRoom) {
            throw 'ソケットルームが見つかりません';
        }
        socketRoom.sockets = socketRoom.sockets.filter((s) => s.id != socketId);
        socketRoom.fulfill = false;
        if (socketRoom.sockets.length == 0) {
            console.log(`ルーム: ${room.roomname}を破棄します`);
            await this.socketController.removeRoom(room.roomname);
            this.roomRepository.deleteRoom(room);
        }
    }
}

export { IUserService, UserService };
