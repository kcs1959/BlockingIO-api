import { Socket } from 'socket.io';
import { userRepository, userService, gameService } from '..';
import { User } from '../application/model/user';

const onConnectionEvent = (socket: Socket): void => {
    const newUser = User.generateUnknownUser();
    newUser.socketId = socket.id;
    userRepository.saveUser(newUser);
};

const onDisconnectEvent = (socket: Socket): void => {
    userService.leave(socket.id);
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
        gameService.startGameIfRoomIsFilled(room);
    } catch (err) {
        console.error(err);
    }
};

export { onJoinRoomEvent, onDisconnectEvent, onConnectionEvent };
