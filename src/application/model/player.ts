type PlayerStatus = 'alive' | 'dead';

import { Direction } from './game';
import { Position } from './position';

import { User } from './user';

export class Player {
    public position: Position;
    public direction: Direction;
    public point: number;
    public uid: string;
    public name: string;
    public status: PlayerStatus;
    constructor(user: User, position: Position, direction: Direction) {
        this.position = position;
        this.direction = direction;
        this.point = 0;
        this.uid = user.uid;
        this.name = user.name;
        this.status = 'alive';
    }
}
