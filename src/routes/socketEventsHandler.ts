import { Socket } from 'socket.io';
import { userRepository, userService, gameService } from '..';
import { User } from '../application/model/user';
import { updateUserEvent } from './socketEvents';

const onConnectionEvent = (socket: Socket): void => {
    const newUser = User.generateUnknownUser();
    newUser.socketId = socket.id;
    userRepository.saveUser(newUser);
    console.log(newUser);
    socket.emit(updateUserEvent.name, newUser);
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

const onRequestAfterGameEvent = async (
    socketId: string,
    selected: 'restart' | 'leave'
): Promise<void> => {
    if (selected === 'restart') {
        const room = await userService.requestToRestartGame(socketId);
        if (room?.getUsers()?.every((u) => u.requestingToStartGame)) {
            // ゲームを同じ部屋で作り直す
            room.currentGame = null;
            gameService.startGameIfRoomIsFilled(room);
        }
    } else if (selected === 'leave') {
        await userService.leave(socketId);
    }
};

const onSetupUidEvent = async (socket: Socket, uid: string): Promise<void> => {
    console.info(`link uid (${uid}) with Socket`);
    await userService.linkUser(uid, socket);
};

export {
    onJoinRoomEvent,
    onDisconnectEvent,
    onConnectionEvent,
    onSetupUidEvent,
    onRequestAfterGameEvent,
};
