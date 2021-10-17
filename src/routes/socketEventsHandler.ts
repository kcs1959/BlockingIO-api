import { Socket } from 'socket.io';
import {
    userRepository,
    socketIOController,
    userService,
    gameService,
} from '..';
import { User } from '../application/model/user';

const onConnectionEvent = (socket: Socket): void => {
    const newUser = User.generateUnknownUser();
    newUser.socketId = socket.id;
    userRepository.saveUser(newUser);
};

const onDisconnectEvent = (socket: Socket): void => {
    const user = userRepository.findUserWithSocketId(socket.id);
    if (user) {
        userRepository.deleteUser(user);
    }
};

const onJoinRoomEvent = async (socketId: string): Promise<void> => {
    const user = userRepository.findUserWithSocketId(socketId);
    if (!user?.socketId) {
        console.error('socketIdがnullです');
        return;
    }
    try {
        const room = await userService.join(user.socketId);
        const socketRoom = socketIOController.findRoom(room.roomname);
        console.log(room, socketRoom);
        if (socketRoom?.fulfill === true) {
            const game = gameService.createGame(
                room.assignedUsers,
                room.roomname
            );
            room.currentGame = game;
            game.start();
        }
    } catch (err) {
        console.error(err);
    }
};

export { onJoinRoomEvent, onDisconnectEvent, onConnectionEvent };
