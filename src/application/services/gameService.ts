import { assert } from 'console';
import { ISocketIOController } from '../../infrastructure/socketIOController';
import { tryMoveEvent, updateFieldEvent } from '../../routes/socketEvents';
import { Field } from '../model/field';
import { Game, Direction } from '../model/game';
import { Npc } from '../model/npc';
import { Player } from '../model/player';
import { User } from '../model/user';

interface IGameService {
    createGame(users: User[], roomName: string): Game;
}

class GameService implements IGameService {
    socketController: ISocketIOController;
    constructor(socketController: ISocketIOController) {
        this.socketController = socketController;
    }

    createGame(users: User[], roomName: string): Game {
        assert(users.length === 2);
        const player1 = new Player(users[0], { x: 1, y: 1 });
        const player2 = new Player(users[1], { x: 8, y: 8 });
        const npc = new Npc('鬼', { x: 1, y: 8 });

        const field = new Field(32);

        const newGame = new Game(field, [player1, player2], npc);
        newGame.setUpdateListener((game) => {
            this.socketController.sendToRoom(
                null,
                roomName,
                updateFieldEvent,
                game
            );
        });

        users.forEach((u) => {
            const socketId = u.socketId;
            if (!socketId) return;
            const socket = this.socketController.getSocket(socketId);
            if (!socket) return;
            this.socketController.register(socket, {
                event: tryMoveEvent,
                handler: async (data: Direction) => {
                    newGame.onTryMove(u.uid, data);
                },
            });
        });
        return newGame;
    }
}

export { IGameService, GameService };
