import { Socket } from 'socket.io-client';
import * as events from '../../../src/routes/socketEvents';

const joinRoom = (socket: Socket): void => {
    socket.emit(events.joinRoomEvent.name, socket.id);
};

export { joinRoom };