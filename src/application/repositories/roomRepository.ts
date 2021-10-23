import { User } from '../model/user';
import { Room } from '../model/room';

interface IRoomRepository {
    getRoomFromUser(user: User): Room | null;
    getRoomFromName(name: string): Room | null;
    saveRoom(room: Room): void;
    deleteRoom(room: Room): void;
    getAvailableRoom(): Room | null;
}

class RoomRepository implements IRoomRepository {
    private rooms: Room[];

    constructor() {
        this.rooms = [];
    }

    getRoomFromUser(user: User): Room | null {
        return this.rooms.find((r) => r.findUser(user.uid) !== null) ?? null;
    }

    getRoomFromName(name: string): Room | null {
        console.log(this.rooms);
        for (const r of this.rooms) {
            if (r.roomname === name) {
                return r;
            }
        }
        return null;
    }

    saveRoom(room: Room): void {
        const index = this.rooms.findIndex((r) => r.roomId === room.roomId);
        if (index != -1) {
            this.rooms[index] = room;
        } else {
            this.rooms.push(room);
        }
    }

    deleteRoom(room: Room): void {
        this.rooms = this.rooms.filter((r) => r !== room);
    }

    getAvailableRoom(): Room | null {
        return this.rooms.find((r) => r.state !== 'Fulfilled') ?? null;
    }
}

export { IRoomRepository, RoomRepository };
