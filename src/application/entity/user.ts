import { v4 as uuidv4 } from 'uuid';

export class User {
    public username: string;
    public point: number;
    public uid: string;
    constructor(username: string) {
        this.username = username;
        this.point = 0;
        this.uid = uuidv4();
    }
}
