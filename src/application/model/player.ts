type PlayerStatus = 'alive' | 'dead';

import { Direction, RelativeDirection } from './game';
import { Position } from './position';

import { User } from './user';

class PlayerBase {
    public position: Position;
    public direction: Direction;
    constructor(position: Position, direction: Direction) {
        this.position = position;
        this.direction = direction;
    }

    // 進行方向から見て、周囲の位置を取得する
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
                forward.row -= 1;
                left.column -= 1;
                right.column += 1;
                break;
            case 'down':
                forward.row += 1;
                left.column += 1;
                right.column -= 1;
                break;
            case 'left':
                forward.column -= 1;
                left.row += 1;
                right.row -= 1;
                break;
            case 'right':
                forward.column += 1;
                left.row -= 1;
                right.row += 1;
                break;
        }
        return { forward, left, right };
    }

    // 相対的な方向に移動し、directionを更新する
    move(relativeDirection: RelativeDirection): void {
        if (relativeDirection === 'stay') {
            // 移動できない場合は向きを反対にして次のときに再試行
            this.direction = this.getBackDiretion();
            return;
        }
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

    getBackDiretion(): Direction {
        switch (this.direction) {
            case 'up':
                return 'down';
            case 'down':
                return 'up';
            case 'left':
                return 'right';
            case 'right':
                return 'left';
        }
    }
}

class Player extends PlayerBase {
    public point: number;
    public uid: string;
    public name: string;
    public status: PlayerStatus;
    constructor(user: User, position: Position, direction: Direction) {
        super(position, direction);
        this.point = 0;
        this.uid = user.uid;
        this.name = user.name;
        this.status = 'alive';
    }
}

export { Player, PlayerBase };
