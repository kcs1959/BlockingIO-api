import { io } from 'socket.io-client';
const socket = io();

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

socket.on('connected', (me: string) => {
    console.log(`your Avatar is ${me}`);
});

socket.on('field', (field: FieldData) => {
    if (fieldArea) {
        fieldArea.innerHTML = field.squares
            .map((row) => row.join(''))
            .join('<br>');
    }
});
