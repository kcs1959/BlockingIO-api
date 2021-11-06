import { ISocketIOController } from '../../infrastructure/socketIOController';
import { roomStateEvent } from '../../routes/socketEvents';
import { IUserRepository } from '../repositories/userRepository';
import { IRoomRepository } from '../repositories/roomRepository';
import { Room } from '../model/room';
import { Socket } from 'socket.io';

interface IUserService {
    linkUser(uid: string, socket: Socket): Promise<void>;
    createRoom(socketId: string): Promise<Room>;
    join(socketId: string): Promise<Room>;
    leave(socketId: string): Promise<void>;
    requestToRestartGame(socketId: string): Promise<Room | null>;
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

    async linkUser(uid: string, socket: Socket): Promise<void> {
        this.socketController.link(uid, socket);
    }

    async createRoom(socketId: string): Promise<Room> {
        const socket = this.socketController.getSocketWithSid(socketId);
        if (!socket) {
            throw 'socket idに対応するソケットが見つかりませんでした';
        }
        const user = this.userRepository.findUserWithSocketId(socketId);
        if (!user) {
            console.error('ユーザーがいません');
            throw 'ユーザーがいません';
        }
        const roomName = await this.socketController.createRoom(socket);
        const room = new Room([user], roomName);
        this.roomRepository.saveRoom(room);
        return room;
    }

    async join(socketId: string): Promise<Room> {
        const socket = this.socketController.getSocketWithSid(socketId);
        if (!socket) {
            // socketが見つからない
            throw 'socketが見つからない';
        }
        const user = this.userRepository.findUserWithSocketId(socketId);
        if (!user) {
            throw 'ユーザーが存在しません';
        }
        if (this.roomRepository.getRoomFromUser(user)) {
            throw '既にこのユーザーはルームに入っています';
        }
        let room = this.roomRepository.getAvailableRoom();
        try {
            if (room) {
                // 利用可能な部屋がある場合
                console.log('利用可能な部屋あり');
                await this.socketController.joinRoom(room.roomname, socket);
                room.addUser(user);
                this.roomRepository.saveRoom(room);
            } else {
                // 利用可能な部屋がない場合
                console.log('利用可能な部屋なし');
                console.log('ルームの新規作成');
                room = await this.createRoom(socketId);
            }

            this.socketController.sendToRoom(
                null,
                room.roomname,
                roomStateEvent,
                room
            );

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
            // ルームに入っていない状態で抜ける場合はあるので、エラーは投げない
            return;
        }
        if (room.currentGame) {
            // ゲームを強制終了して破棄
            room.currentGame.terminate();
            room.currentGame = null;
        }
        room.removeUser(user);
        const socket = this.socketController.getSocketWithSid(socketId);
        if (socket) {
            this.socketController.leaveRoom(room.roomname, socket);
            this.socketController.send(socket, roomStateEvent, {
                state: 'notJoining',
            });
        }
        console.log(`${socketId}のユーザを${room.roomname}から削除しました`);
        console.log(room);
        const allUsers = room.getUsers();
        if (room.state === 'Empty' || allUsers.length < 2) {
            console.log(`ルーム: ${room.roomname}を破棄します`);
            await this.socketController.removeRoom(room.roomname);
            this.roomRepository.deleteRoom(room);
        } else {
            this.socketController.sendToRoom(
                null,
                room.roomname,
                roomStateEvent,
                room
            );
        }
    }

    async requestToRestartGame(socketId: string): Promise<Room | null> {
        const user = this.userRepository.findUserWithSocketId(socketId);
        if (!user) return null;
        const room = this.roomRepository.getRoomFromUser(user);
        if (!room || !room.currentGame || room.currentGame.state !== 'Finish')
            return null;
        user.requestingToStartGame = true;
        this.socketController.sendToRoom(
            null,
            room.roomname,
            roomStateEvent,
            room
        );
        return room;
    }
}

export { IUserService, UserService };
