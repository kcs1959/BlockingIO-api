import { User } from '../model/user';
import * as database from '../../infrastructure/database';
import { PoolClient } from 'pg';
import { UserEntity } from '../entity/user';

interface IUserRepository {
    findUserWithUid(uid: string): User | undefined;
    findUserWithSocketId(socketId: string): User | undefined;
    saveUser(user: User): void;
    deleteUser(user: User): void;
}

class UserRepository implements IUserRepository {
    users: User[];

    client: PoolClient | undefined;

    constructor() {
        this.users = [];
        database
            .connect()
            .then(async (client) => {
                this.client = client;

                const sql = 'SELECT * FROM users';
                const users: UserEntity[] = await database.performSQL(
                    sql,
                    null,
                    client
                );
                console.log('users-entity', users);
                this.users = users.map(
                    (user) => new User(user.name, user.point, user.id, null)
                );
                console.log('users-model', this.users);
            })
            .catch((err) => console.error(err));
    }

    findUserWithSocketId(socketId: string): User | undefined {
        return this.users.find((u) => u.socketId === socketId);
    }

    findUserWithUid(uid: string): User | undefined {
        return this.users.find((u) => u.uid === uid);
    }

    async saveUser(user: User): Promise<void> {
        if (this.client == null) {
            console.error('データベースクライアントがnullです');
            return;
        }
        this.users.push(user);
        const sql = 'INSERT INTO users VALUES ($1, $2, $3)';
        const values = [user.uid, user.name, user.point];
        await database.performSQL(sql, values, this.client);
    }

    async deleteUser(user: User): Promise<void> {
        if (this.client == null) {
            console.error('データベースクライアントがnullです');
            return;
        }
        this.users = this.users.filter((u) => u.uid !== user.uid);
        const sql = 'DELETE FROM users WHERE id = $1';
        const values = [user.uid];
        await database.performSQL(sql, values, this.client);
    }
}

export { IUserRepository, UserRepository };
