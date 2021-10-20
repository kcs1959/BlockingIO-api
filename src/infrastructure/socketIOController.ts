import { assert } from 'console';
import { Server, Socket } from 'socket.io';

interface SocketEvent {
    name: string;
}

interface EventRegistration<Response> {
    event: SocketEvent;
    handler: (data: Response) => Promise<void>;
}

interface ISocketIOController {
    register<Response>(
        listener: Socket | Server,
        registration: EventRegistration<Response>
    ): void;

    // Connection
    onConnection(handler: (socket: Socket) => void): void;
    onDisconnect(socket: Socket, handler: () => void): void;

    // Socket
    getSocket(id: string): Socket | null;

    // Send
    send<Data>(sender: Socket, event: SocketEvent, data: Data): boolean;
    sendToRoom<Data>(
        sender: Socket | null,
        name: string,
        event: SocketEvent,
        data: Data
    ): boolean;
    broadcast<Data>(sender: Socket, event: SocketEvent, data: Data): boolean;

    // Room
    //numberOfRooms(): number;
    //getAvailableRoomName(): string | null;
    createRoom(host: Socket): Promise<string>;
    removeRoom(name: string): Promise<void>;
    //findRoom(name: string): SocketRoom | null;
    joinRoom(name: string, newcomer: Socket): Promise<boolean>;
    releaseRoom(name: string): void;
}

class SocketIOController implements ISocketIOController {
    io: Server;
    sockets: Socket[];
    rooms: Set<string>;

    roomIndex: number;

    constructor(io: Server) {
        this.io = io;
        this.sockets = [];
        this.rooms = new Set();
        this.roomIndex = 0;
    }

    register<Response>(
        listener: Socket | Server,
        registration: EventRegistration<Response>
    ): void {
        listener.on(registration.event.name, async (data: Response) => {
            console.log(registration.event.name);
            await registration.handler(data);
        });
    }

    onConnection(handler: (socket: Socket) => void): void {
        this.io.on('connection', (socket) => {
            this.sockets.push(socket);
            handler(socket);
        });
    }

    onDisconnect(socket: Socket, handler: () => void): void {
        socket.on('disconnect', () => {
            this.sockets = this.sockets.filter((s) => s.id !== socket.id);
            handler();
        });
    }

    getSocket(id: string): Socket | null {
        const socket = this.sockets.find((socket) => socket.id === id);
        if (!socket) {
            return null;
        }
        return socket;
    }

    send<Data>(sender: Socket, event: SocketEvent, data: Data): boolean {
        return sender.emit(event.name, [data]);
    }

    sendToRoom<Data>(
        sender: Socket | null,
        name: string,
        event: SocketEvent,
        data: Data
    ): boolean {
        if (sender) {
            return sender.to(name).emit(event.name, [data]);
        }
        return this.io.to(name).emit(event.name, [data]);
    }

    broadcast<Data>(sender: Socket, event: SocketEvent, data: Data): boolean {
        return sender.broadcast.emit(event.name, [data]);
    }

    // getAvailableRoomName(): string | null {
    //     console.log(this.rooms);
    //     for (const r of this.rooms) {
    //         if (r.fulfill) continue;
    //         return r.name;
    //     }
    //     return null;
    // }

    // numberOfRooms(): number {
    //     return this.rooms.size;
    // }

    async createRoom(host: Socket): Promise<string> {
        const roomName = `ルーム${this.roomIndex++}`;
        assert(!this.rooms.has(roomName));
        this.rooms.add(roomName);
        await host.join(roomName);
        return roomName;
    }

    async removeRoom(name: string): Promise<void> {
        if (!this.rooms.has(name)) {
            return;
        }
        this.rooms.delete(name);
    }

    // findRoom(name: string): SocketRoom | null {
    //     let room: SocketRoom | null = null;
    //     for (const r of this.rooms.values()) {
    //         if (r.name === name) {
    //             room = r;
    //             break;
    //         }
    //     }
    //     return room;
    // }

    // findAvailableRoom(name: string): SocketRoom | null {
    //     let room: SocketRoom | null = null;
    //     for (const r of this.rooms.values()) {
    //         if (r.name === name && !r.fulfill) {
    //             room = r;
    //             break;
    //         }
    //     }
    //     return room;
    // }

    async joinRoom(name: string, newcomer: Socket): Promise<boolean> {
        if (!this.rooms.has(name)) {
            return false;
        }
        await newcomer.join(name);
        return true;
    }

    releaseRoom(name: string): void {
        this.io.socketsLeave(name);
        for (const room of this.rooms.values()) {
            if (room === name) {
                this.rooms.delete(room);
            }
        }
    }
}

export {
    ISocketIOController,
    SocketIOController,
    SocketEvent,
    EventRegistration,
};
