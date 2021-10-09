import { Position } from './position';

export class Npc {
    public position: Position;
    public name: string;
    constructor(name: string, position: Position) {
        this.position = position;
        this.name = name;
    }
}
