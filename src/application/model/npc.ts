import { assert } from 'console';
import * as Util from '../../common/util';
import { Field } from './field';
import { Direction } from './game';
import { Player, PlayerBase } from './player';
import { Position } from './position';

export class Npc extends PlayerBase {
    public name: string;
    constructor(name: string, position: Position, direction: Direction) {
        super(position, direction);
        this.name = name;
    }

    calcNextMove(field: Field, players: Player[]): void {
        const livingPlayers = players.filter((p) => p.status === 'alive');
        if (livingPlayers.length === 0) return;
        livingPlayers.sort((p1, p2) => {
            return (
                Util.calcDistance(p1.position, this.position) -
                Util.calcDistance(p2.position, this.position)
            );
        });
        const targetPlayer = livingPlayers[0];
        const rowDiff = targetPlayer.position.row - this.position.row;
        const columnDiff = targetPlayer.position.column - this.position.column;
        assert(rowDiff !== 0 || columnDiff !== 0);
        if (rowDiff === 0) {
            this.direction = columnDiff > 0 ? 'right' : 'left';
        } else if (columnDiff === 0) {
            this.direction = rowDiff > 0 ? 'down' : 'up';
        } else {
            if (Util.getRandomInt(0, 2) === 0) {
                this.direction = rowDiff > 0 ? 'down' : 'up';
            } else {
                this.direction = columnDiff > 0 ? 'right' : 'left';
            }
        }
    }
}
