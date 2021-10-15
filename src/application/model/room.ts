import { User } from './user';
import { v4 as uuidv4 } from 'uuid';

export class Room {
    public assignedUsers: User[];
    public roomId: string;
    constructor(assignedUsers: User[]) {
        this.assignedUsers = assignedUsers;
        this.roomId = uuidv4();
    }
}
