import { Position } from '../application/model/position';

// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function calcDistance(p1: Position, p2: Position): number {
    return Math.pow(p1.row - p2.row, 2) + Math.pow(p1.column - p2.column, 2);
}

export { getRandomInt, calcDistance };
