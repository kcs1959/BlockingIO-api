import { Socket } from 'socket.io-client';
import * as events from '../../../src/routes/socketEvents';
import { Room, RoomState } from '../../../src/application/model/room';
import { cleanGame, connectToGame } from './game';

const roomStateView: HTMLElement = document.getElementById(
    'roomState'
) as HTMLElement;
let pastState: RoomState | null = null;
roomStateView.innerHTML = 'ルーム未参加';

const joinRoom = (socket: Socket): void => {
    socket.emit(events.joinRoomEvent.name, socket.id);

    socket.off(events.roomStateEvent.name);
    socket.on(events.roomStateEvent.name, (rooms: Room[]) => {
        const room = rooms[0];
        //console.log(`Room updated: \n${JSON.stringify(room)}`);
        console.log(`${pastState} -> ${room.state}`);
        if (room.state === 'Fulfilled') {
            console.log(`参加メンバーが揃いました`);
            console.log(`ゲームを始めます`);
            connectToGame(socket);
            roomStateView.innerHTML = 'ゲーム中';
        } else if (room.state === 'Opening') {
            if (pastState === 'Fulfilled') {
                console.log(`ユーザが退出したため待機室に戻りました`);
                cleanGame(socket);
            }
            roomStateView.innerHTML = '待機中';
        }
        pastState = room.state;
    });
};

export { joinRoom };
