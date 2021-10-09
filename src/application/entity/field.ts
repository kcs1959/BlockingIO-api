export class Field {
    public length: number;
    public square: number[][];
    constructor(length: number) {
        const square = new Array(length);
        for (let i = 0; i < length; i++) {
            square[i] = new Array(length).fill(0);
        }

        /*
        const square2 = (length: number): number[][] => {
            return Array.from(new Array(length), _ => new Array(length).fill(0));
        };

        const square3 = (length: number): number[][] => {
            return [...Array(length)].map(() => Array(length).fill(0));
        };
        */

        this.square = square
        this.length = 1;
    }
}
