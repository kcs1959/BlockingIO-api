import { User } from './user';
import { Game } from './game';
import { v4 as uuidv4 } from 'uuid';

export class Room {
    public assignedUsers: User[];
    public roomId: string;
    public roomname: string;
    public currentGame: Game | null;
    constructor(assignedUsers: User[], roomname: string) {
        this.assignedUsers = assignedUsers;
        this.roomId = uuidv4();
        this.roomname = roomname;
        this.currentGame = null;
    }
}
