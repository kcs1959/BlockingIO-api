import { io } from 'socket.io-client';
import { User } from '../../src/application/model/user';
import { updateUserEvent, setupUidEvent } from '../../src/routes/socketEvents';
import { requestAfterGame } from './rooms/game';
import { joinRoom } from './rooms/room';
const socket = io();

const joinRoomButton = document.getElementById('joinRoomButton');
joinRoomButton?.addEventListener('click', () => {
    joinRoom(socket);
});
const restartGameButton = document.getElementById('restartGameButton');
restartGameButton?.addEventListener('click', () => {
    requestAfterGame(socket, 'restart');
});
const leaveRoomButton = document.getElementById('leaveRoomButton');
leaveRoomButton?.addEventListener('click', () => {
    requestAfterGame(socket, 'leave');
});
(document.getElementById('beforeGameButtons') as HTMLElement).style.display =
    'flex';
(document.getElementById('afterGameButtons') as HTMLElement).style.display =
    'none';

socket.on('connect', (): void => {
    console.log('connect');
    const storage = window['localStorage'];
    const uid = storage.getItem('uid');
    console.log(uid);
    if (uid) {
        socket.emit(setupUidEvent.name, uid);
    }
});

socket.on('disconnect', (): void => {
    console.log('disconnect');
});

socket.on(updateUserEvent.name, (user: User): void => {
    const storage = window['localStorage'];
    storage.setItem('uid', user.uid);
});
