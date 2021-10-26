import { io } from 'socket.io-client';
import { User } from '../../src/application/model/user';
import { updateUserEvent, setupUidEvent } from '../../src/routes/socketEvents';
import { joinRoom } from './rooms/room';
const socket = io();

const joinRoomButton = document.getElementById('joinRoomButton');
joinRoomButton?.addEventListener('click', () => {
    joinRoom(socket);
});

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
