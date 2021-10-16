import { Socket } from 'socket.io';
import { userRepository, userService } from '..';
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
        await userService.join(user.socketId);
    } catch (err) {
        console.error(err);
    }
};

export { onJoinRoomEvent, onDisconnectEvent, onConnectionEvent };
