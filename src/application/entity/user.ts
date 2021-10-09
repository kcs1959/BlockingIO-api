import { v4 as uuidv4 } from 'uuid';

export class User {
    public name: string;
    public point: number;
    public uid: string;
    constructor(name: string) {
        this.name = name;
        this.point = 0;
        this.uid = uuidv4();
    }
}
