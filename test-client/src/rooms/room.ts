import { Socket } from 'socket.io-client';
import * as events from '../../../src/routes/socketEvents';
import { Room } from '../../../src/application/model/room';
import { connectToGame } from './game';

const joinRoom = (socket: Socket): void => {
    socket.emit(events.joinRoomEvent.name, socket.id);

    socket.off(events.roomStateEvent.name);
    socket.on(events.roomStateEvent.name, (rooms: Room[]) => {
        const room = rooms[0];
        console.log(`Room updated: \n${JSON.stringify(room)}`);
        console.log(room.state);
        if (room.state === 'Fulfilled') {
            console.log(`参加メンバーが揃いました`);
            console.log(`ゲームを始めます`);
            connectToGame(socket);
        }
    });
};

export { joinRoom };
