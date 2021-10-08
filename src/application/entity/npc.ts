export class Npc {
    public position: { x: number; y: number };
    public name: string;
    constructor(name: string) {
        this.position = { x: 0, y: 0 };
        this.name = name;
    }
}
