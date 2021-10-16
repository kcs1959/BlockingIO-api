import { User } from '../model/user';

interface IUserRepository {
    findUserWithUid(uid: string): User | undefined;
    findUserWithSocketId(socketId: string): User | undefined;
    saveUser(user: User): void;
    deleteUser(user: User): void;
}

class UserRepository implements IUserRepository {
    users: User[];

    constructor() {
        this.users = [];
    }

    findUserWithSocketId(socketId: string): User | undefined {
        return this.users.find((u) => u.socketId === socketId);
    }

    findUserWithUid(uid: string): User | undefined {
        return this.users.find((u) => u.uid === uid);
    }

    saveUser(user: User): void {
        this.users.push(user);
    }

    deleteUser(user: User): void {
        this.users = this.users.filter((u) => u.uid !== user.uid);
    }
}

export { IUserRepository, UserRepository };
