import { User } from '../model/user';
import { Room } from '../model/room';

interface IRoomRepository {
    getRoomFromUser(user: User): Room | null;
    getRoomFromName(name: string): Room | null;
    saveRoom(room: Room): void;
    deleteRoom(room: Room): void;
}

class RoomRepository implements IRoomRepository {
    private rooms: Room[];

    constructor() {
        this.rooms = [];
    }

    getRoomFromUser(user: User): Room | null {
        return (
            this.rooms.find((r) =>
                r.assignedUsers.find((u) => u.uid == user.uid)
            ) ?? null
        );
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
}

export { IRoomRepository, RoomRepository };
