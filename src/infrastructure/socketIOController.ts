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
    numberOfRooms(): number;
    getAvailableRoomName(): string | null;
    createRoom(name: string, host: Socket): Promise<void>;
    joinRoom(name: string, newcomer: Socket): Promise<void>;
    releaseRoom(name: string): void;
    leaveRoom(socket: Socket, name: string): Promise<void>;
}

interface SocketRoom {
    sockets: Socket[];
    name: string;
    maxMember: number;
    fulfill: boolean;
}

class SocketIOController implements ISocketIOController {
    io: Server;
    sockets: Socket[];
    rooms: Set<SocketRoom>;

    constructor(io: Server) {
        this.io = io;
        this.sockets = [];
        this.rooms = new Set();
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

    getAvailableRoomName(): string | null {
        console.log(this.rooms);
        for (const r of this.rooms) {
            if (r.fulfill) continue;
            return r.name;
        }
        return null;
    }

    numberOfRooms(): number {
        return this.rooms.size;
    }

    async createRoom(name: string, host: Socket): Promise<void> {
        const duplicateRoomName = this.findRoom(name) != null;
        if (duplicateRoomName) {
            console.log('このルーム名は既にあります');
            return;
        }
        const newRoom: SocketRoom = {
            name: name,
            sockets: [host],
            maxMember: 2,
            fulfill: false,
        };
        this.rooms.add(newRoom);
        await host.join(name);
    }

    findRoom(name: string): SocketRoom | null {
        let room: SocketRoom | null = null;
        for (const r of this.rooms.values()) {
            if (r.name === name) {
                room = r;
                break;
            }
        }
        return room;
    }

    findAvailableRoom(name: string): SocketRoom | null {
        let room: SocketRoom | null = null;
        for (const r of this.rooms.values()) {
            if (r.name === name && !r.fulfill) {
                room = r;
                break;
            }
        }
        return room;
    }

    async joinRoom(name: string, newcomer: Socket): Promise<void> {
        const room = this.findAvailableRoom(name);
        if (!room) {
            console.log('availableRoomがない');
            return;
        }
        if (room.sockets.includes(newcomer)) {
            console.error('既にこのルームに入っている');
            return;
        }
        await newcomer.join(name);
        room.sockets.push(newcomer);
        const isAvailable = room.sockets.length < room.maxMember;
        if (!isAvailable) {
            console.log(`${room.name}は定員に達しました`);
            this.rooms.delete(room);
            room.fulfill = true;
            this.rooms.add(room);
        }
    }

    releaseRoom(name: string): void {
        this.io.socketsLeave(name);
        for (const room of this.rooms.values()) {
            if (room.name === name) {
                this.rooms.delete(room);
            }
        }
    }

    async leaveRoom(socket: Socket, name: string): Promise<void> {
        const room = this.findRoom(name);
        if (!room) return;
        await socket.leave(name);
        room.sockets = room.sockets.filter((s) => s.id !== socket.id);
        const isLastMember = room.sockets.length === 0;
        if (isLastMember) {
            this.rooms.delete(room);
        }
    }
}

export {
    ISocketIOController,
    SocketIOController,
    SocketEvent,
    EventRegistration,
};
