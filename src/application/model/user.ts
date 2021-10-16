import { v4 as uuidv4 } from 'uuid';

export class User {
    public name: string;
    public point: number;
    public uid: string;
    public socketId: string | null;
    constructor(name: string) {
        this.name = name;
        this.point = 0;
        this.uid = uuidv4();
        this.socketId = null;
    }

    static generateUnknownUser(): User {
        return new User('名無しユーザー');
    }
}
