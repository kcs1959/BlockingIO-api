import { Square } from './square';

export class Field {
    public length: number;
    public squares: Square[][];
    constructor(length: number) {
        this.length = length;
        this.squares = [];
        for (let i = 0; i < length; i++) {
            this.squares[i] = [];
            for (let j = 0; j < length; j++) {
                this.squares[i][j] = new Square();
            }
        }
    }
}
