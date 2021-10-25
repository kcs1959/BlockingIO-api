type PlayerStatus = 'alive' | 'dead';

import { Direction, RelativeDirection } from './game';
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

    getAmbientSquaresPosition(): {
        forward: Position;
        left: Position;
        right: Position;
    } {
        const forward = { ...this.position };
        const left = { ...this.position };
        const right = { ...this.position };
        switch (this.direction) {
            case 'up':
                forward.y -= 1;
                left.x -= 1;
                right.x += 1;
                break;
            case 'down':
                forward.y += 1;
                left.x += 1;
                right.x -= 1;
                break;
            case 'left':
                forward.x -= 1;
                left.y -= 1;
                right.y += 1;
                break;
            case 'right':
                forward.x += 1;
                left.y += 1;
                right.y -= 1;
                break;
        }
        return { forward, left, right };
    }

    move(relativeDirection: RelativeDirection): void {
        if (relativeDirection === 'stay') return;
        const { forward, left, right } = this.getAmbientSquaresPosition();
        switch (relativeDirection) {
            case 'forward':
                this.position = forward;
                break;
            case 'left':
                this.position = left;
                this.direction = this.getLeftDiretion();
                break;
            case 'right':
                this.position = right;
                this.direction = this.getRightDiretion();
                break;
        }
        console.log(this.uid[0], ' moved:', this.position, this.direction);
    }

    getLeftDiretion(): Direction {
        switch (this.direction) {
            case 'up':
                return 'left';
            case 'down':
                return 'right';
            case 'left':
                return 'down';
            case 'right':
                return 'up';
        }
    }

    getRightDiretion(): Direction {
        switch (this.direction) {
            case 'up':
                return 'right';
            case 'down':
                return 'left';
            case 'left':
                return 'up';
            case 'right':
                return 'down';
        }
    }
}
