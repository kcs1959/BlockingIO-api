import { io } from 'socket.io-client';
import { fulfillRoomEvent } from '../../src/routes/socketEvents';
import { connectToGame } from './rooms/game';
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

socket.on(fulfillRoomEvent.name, (room) => {
    const message = JSON.stringify(room);
    console.log(`${message}にて参加メンバーが揃いました`);
    console.log(`ゲームを始めます`);
    connectToGame(socket);
});
