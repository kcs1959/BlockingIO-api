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
    unregister(listener: Socket | Server, event: SocketEvent): void;

    // Connection
    onConnection(handler: (socket: Socket) => void): void;
    onDisconnect(socket: Socket, handler: () => void): void;

    // ユーザーのuidとSocketを紐づける
    link(uid: string, socket: Socket): void;

    // Socket
    getSocketWithUid(uid: string): Socket | null;
    getSocketWithSid(sid: string): Socket | null;

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
    createRoom(host: Socket): Promise<string>;
    removeRoom(name: string): Promise<void>;
    joinRoom(name: string, newcomer: Socket): Promise<boolean>;
    leaveRoom(name: string, leaver: Socket): Promise<boolean>;
    releaseRoom(name: string): void;
}

class SocketIOController implements ISocketIOController {
    io: Server;
    /// ユーザー情報とリンクされているSocketsが格納されている
    /// keyはデータベースに保存されているuidに対応
    linkedSockets: Map<string, Socket>;
    /// ユーザー情報とリンクされていないSocketsが格納されている
    sockets: Socket[];
    rooms: Set<string>;

    roomIndex: number;

    constructor(io: Server) {
        this.io = io;
        this.linkedSockets = new Map();
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

    unregister(listener: Socket | Server, event: SocketEvent): void {
        listener.removeAllListeners(event.name);
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

    link(uid: string, socket: Socket): void {
        this.linkedSockets.set(uid, socket);
    }

    getSocketWithSid(sid: string): Socket | null {
        const socket = this.sockets.find((socket) => socket.id === sid);
        if (!socket) {
            return null;
        }
        return socket;
    }

    getSocketWithUid(uid: string): Socket | null {
        const socket = this.linkedSockets.get(uid);
        if (!socket) {
            return null;
        }
        return socket;
    }

    send<Data>(sender: Socket, event: SocketEvent, data: Data): boolean {
        return sender.emit(event.name, data);
    }

    sendToRoom<Data>(
        sender: Socket | null,
        name: string,
        event: SocketEvent,
        data: Data
    ): boolean {
        if (sender) {
            return sender.to(name).emit(event.name, data);
        }
        return this.io.to(name).emit(event.name, data);
    }

    broadcast<Data>(sender: Socket, event: SocketEvent, data: Data): boolean {
        return sender.broadcast.emit(event.name, data);
    }

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

    async joinRoom(name: string, newcomer: Socket): Promise<boolean> {
        if (!this.rooms.has(name)) {
            return false;
        }
        await newcomer.join(name);
        return true;
    }
    async leaveRoom(name: string, leaver: Socket): Promise<boolean> {
        if (!this.rooms.has(name)) {
            return false;
        }
        await leaver.leave(name);
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
