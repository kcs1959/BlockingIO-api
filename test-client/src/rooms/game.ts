import { Socket } from 'socket.io-client';
import * as events from '../../../src/routes/socketEvents';
import { Direction, Game } from '../../../src/application/model/game';

const fieldArea: HTMLElement = document.getElementById('field') as HTMLElement;
const gameStateView: HTMLElement = document.getElementById(
    'gameState'
) as HTMLElement;
const afterButtons = document.getElementById('afterGameButtons') as HTMLElement;

function drawField(data: string[][]): void {
    fieldArea.innerHTML = '';
    data.forEach((r) => {
        const rowElement: HTMLElement = document.createElement('div');
        rowElement.classList.add('field-row');
        r.forEach((c) => {
            const cellElement: HTMLElement = document.createElement('div');
            cellElement.classList.add('field-cell');
            cellElement.innerHTML = c;
            const num = parseInt(c);
            if (num) {
                const notGreen = Math.min(240 - num * 10, 240);
                cellElement.style.backgroundColor = `rgb(${notGreen}, 240, ${notGreen})`;
            }
            rowElement.appendChild(cellElement);
        });
        fieldArea.appendChild(rowElement);
    });
}

const fieldBase: string[][] = [];
const fieldWidth = 32;
for (let i = 0; i < fieldWidth; i++) {
    fieldBase[i] = [];
    for (let j = 0; j < fieldWidth; j++) {
        fieldBase[i][j] = '０';
    }
}

const tryMove = (socket: Socket, data: Direction): void => {
    socket.emit(events.tryMoveEvent.name, data);
};

function connectToGame(socket: Socket): void {
    socket.off(events.updateFieldEvent.name);
    socket.on(events.updateFieldEvent.name, (game: Game) => {
        if (game.state === 'Finish') {
            gameStateView.innerHTML = `${game.state} winner is: ${game.winner
                .map((p) => p.name)
                .join()}`;
            afterButtons.style.display = 'flex';
        } else {
            gameStateView.innerHTML = `${game.state}`;
            afterButtons.style.display = 'none';
        }
        const field = game.battleField.squares.map((r) =>
            r.map((c) => c.height.toString())
        );
        const aPos = game.listOfPlayer[0].position;
        field[aPos.row][aPos.column] = '<span class=player>Ａ</span>';
        const bPos = game.listOfPlayer[1].position;
        field[bPos.row][bPos.column] = '<span class=player>Ｂ</span>';
        const tPos = game.tagger.position;
        field[tPos.row][tPos.column] = '<span class=tagger>Ｔ</span>';
        drawField(field);
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
            tryMove(socket, 'down');
        } else if (event.key === 'd') {
            console.log('d');
            tryMove(socket, 'right');
        }
    }

    document.body.removeEventListener('keydown', keyDownEventHandler);
    document.body.addEventListener('keydown', keyDownEventHandler);
}

function cleanGame(socket: Socket): void {
    socket.off(events.updateFieldEvent.name);
    fieldArea.innerHTML = '';
    afterButtons.style.display = 'none';
}

function requestAfterGame(socket: Socket, action: 'restart' | 'leave'): void {
    socket.emit(events.requestAfterGameEvent.name, action);
}

export { connectToGame, cleanGame, requestAfterGame };
