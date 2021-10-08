export class Field {
    public length: number;
    public square: number[][];
    constructor(square: number[][]) {
        this.square = square;
        this.length = 1;
    }
}
