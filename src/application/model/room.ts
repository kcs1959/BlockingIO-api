import { User } from './user';
import { Game } from './game';
import { v4 as uuidv4 } from 'uuid';
import { assert } from 'console';

class Room {
    private assignedUsers: User[];
    public roomId: string;
    public roomname: string;
    public currentGame: Game | null;
    public state: RoomState;
    public maxMember: number;
    constructor(assignedUsers: User[], roomname: string) {
        this.maxMember = 2;
        assert(
            assignedUsers.length <= this.maxMember,
            `Room can only have ${this.maxMember} members`
        );
        this.assignedUsers = assignedUsers;
        this.roomId = uuidv4();
        this.roomname = roomname;
        this.currentGame = null;
        if (this.assignedUsers.length === this.maxMember) {
            this.state = 'Fulfilled';
        } else if (this.assignedUsers.length === 0) {
            this.state = 'Empty';
        } else {
            this.state = 'Opening';
        }
    }

    public addUser(user: User): void {
        if (this.state === 'Fulfilled') {
            throw new Error('Room is already full');
        }
        this.assignedUsers.push(user);
        if (this.assignedUsers.length === this.maxMember) {
            this.state = 'Fulfilled';
        }
    }

    public removeUser(user: User): void {
        this.assignedUsers = this.assignedUsers.filter(
            (u) => u.uid !== user.uid
        );
        if (this.assignedUsers.length === 0) {
            this.state = 'Empty';
        } else {
            this.state = 'Opening';
        }
    }

    public findUser(uid: string): User | null {
        return this.assignedUsers.find((u) => u.uid === uid) ?? null;
    }

    public getUsers(): User[] {
        return [...this.assignedUsers];
    }
}

type RoomState = 'Empty' | 'Opening' | 'Fulfilled';

export { Room, RoomState };
