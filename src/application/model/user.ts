import { v4 as uuidv4 } from 'uuid';

export class User {
    public name: string;
    public point: number;
    public uid: string;
    public socketId: string | null;
    constructor(
        name: string,
        point: number,
        uid: string | null,
        socketId: string | null
    ) {
        this.name = name;
        this.point = point;
        this.uid = uid || uuidv4();
        this.socketId = socketId;
    }

    static generateUnknownUser(): User {
        return new User('名無しユーザー', 0, null, null);
    }
}
