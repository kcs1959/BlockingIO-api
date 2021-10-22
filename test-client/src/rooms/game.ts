import { Socket } from 'socket.io-client';
import * as events from '../../../src/routes/socketEvents';
import { Direction, Game } from '../../../src/application/model/game';

const fieldArea: HTMLElement | null = document.getElementById('field');

const fieldBase: string[][] = [];
const fieldWidth = 32;
for (let i = 0; i < fieldWidth; i++) {
    fieldBase[i] = [];
    for (let j = 0; j < fieldWidth; j++) {
        fieldBase[i][j] = '０';
    }
}

if (fieldArea) {
    fieldArea.innerHTML = fieldBase.map((r) => r.join('')).join('<br>');
}

const tryMove = (socket: Socket, data: Direction): void => {
    socket.emit(events.tryMoveEvent.name, data);
};

function connectToGame(socket: Socket): void {
    socket.off(events.updateFieldEvent.name);
    socket.on(events.updateFieldEvent.name, (game: Game[]) => {
        if (fieldArea) {
            const field: string[][] = JSON.parse(JSON.stringify(fieldBase));
            const aPos = game[0].listOfPlayer[0].position;
            field[aPos.x][aPos.y] = '<span class=player>Ａ</span>';
            const bPos = game[0].listOfPlayer[1].position;
            field[bPos.x][bPos.y] = '<span class=player>Ｂ</span>';
            const tPos = game[0].tagger.position;
            field[tPos.x][tPos.y] = '<span class=tagger>Ｔ</span>';
            fieldArea.innerHTML = field.map((r) => r.join('')).join('<br>');
        }
    });

    function keyDownEventHandler(event: KeyboardEvent): void {
        if (event.key === 'w') {
            console.log('w');
            tryMove(socket, 'up');
        } else if (event.key === 'a') {
            console.log('a');
            tryMove(socket, 'left');
        } else if (event.key === 's') {
            console.log('s');
            tryMove(socket, 'right');
        } else if (event.key === 'd') {
            console.log('d');
            tryMove(socket, 'down');
        }
    }

    document.body.removeEventListener('keydown', keyDownEventHandler);
    document.body.addEventListener('keydown', keyDownEventHandler);
}

export { connectToGame };
