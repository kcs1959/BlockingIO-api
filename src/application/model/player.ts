type PlayerStatus = 'alive' | 'dead';

import { Position } from './position';

import { User } from './user';

export class Player {
    public position: Position;
    public point: number;
    public uid: string;
    public name: string;
    public status: PlayerStatus;
    constructor(user: User, position: Position) {
        this.position = position;
        this.point = 0;
        this.uid = user.uid;
        this.name = user.name;
        this.status = 'alive';
    }
}
