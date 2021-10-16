import { io } from 'socket.io-client';
import { fulfillRoomEvent } from '../../src/routes/socket-events';
import { joinRoom } from './rooms/room';
const socket = io();

const joinRoomButton = document.getElementById('joinRoomButton');
joinRoomButton?.addEventListener('click', () => {
    joinRoom(socket);
});

const fieldArea: HTMLElement | null = document.getElementById('field');

if (fieldArea) {
    fieldArea.innerHTML = Array(33).join(Array(33).join('０') + '<br>');
}

document.body.addEventListener('keydown', (event) => {
    if (event.key === 'w') {
        console.log('w');
        socket.emit('move', 'up');
    } else if (event.key === 'a') {
        console.log('a');
        socket.emit('move', 'left');
    } else if (event.key === 's') {
        console.log('s');
        socket.emit('move', 'down');
    } else if (event.key === 'd') {
        console.log('d');
        socket.emit('move', 'right');
    }
});

interface FieldData {
    squares: string[][];
}

socket.on('connect', (): void => {
    console.log('connect');
});

socket.on('disconnect', (): void => {
    console.log('disconnect');
});

socket.on('field', (field: FieldData) => {
    if (fieldArea) {
        fieldArea.innerHTML = field.squares
            .map((row) => row.join(''))
            .join('<br>');
    }
});

socket.on(fulfillRoomEvent.name, (room) => {
    const message = JSON.stringify(room);
    console.log(`${message}にて参加メンバーが揃いました`);
});
