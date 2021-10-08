import { Server, Socket } from 'socket.io';

interface SocketEvent {
    name: string;
}

interface EventRegistration<Response> {
    event: SocketEvent;
    handler: (data: Response) => void;
}

class SocketIOController {
    private io: Server;
    private sockets: Socket[];

    constructor(io: Server) {
        this.io = io;
        this.sockets = [];
    }

    register<Response>(
        listener: Socket | Server,
        registration: EventRegistration<Response>
    ): void {
        listener.on(registration.event.name, (data: Response) => {
            registration.handler(data);
        });
    }

    onConnection(handler: () => void): void {
        const registration: EventRegistration<Socket> = {
            event: {
                name: 'connection',
            },
            handler: (socket) => {
                this.sockets.push(socket);
                handler();
            },
        };
        this.register(this.io, registration);
    }

    onDisconnect(handler: () => void): void {
        const registration: EventRegistration<void> = {
            event: {
                name: 'disconnect',
            },
            handler: handler,
        };
        this.register(this.io, registration);
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

    broadcast<Data>(sender: Socket, event: SocketEvent, data: Data): boolean {
        return sender.broadcast.emit(event.name, [data]);
    }

    async joinRoom(name: string, newcomer: Socket): Promise<void> {
        await newcomer.join(name);
    }

    releaseRoom(name: string): void {
        this.io.socketsLeave(name);
    }

    async leaveRoom(socket: Socket, name: string): Promise<void> {
        await socket.leave(name);
    }
}

export { SocketIOController, SocketEvent, EventRegistration };
