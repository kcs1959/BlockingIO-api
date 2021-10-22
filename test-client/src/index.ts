import { io } from 'socket.io-client';
import { joinRoom } from './rooms/room';
const socket = io();

const joinRoomButton = document.getElementById('joinRoomButton');
joinRoomButton?.addEventListener('click', () => {
    joinRoom(socket);
});

socket.on('connect', (): void => {
    console.log('connect');
});

socket.on('disconnect', (): void => {
    console.log('disconnect');
});
