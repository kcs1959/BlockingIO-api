import { assert } from 'console';
import { ISocketIOController } from '../../infrastructure/socketIOController';
import { tryMoveEvent, updateFieldEvent } from '../../routes/socketEvents';
import { Field } from '../model/field';
import { Game, Direction } from '../model/game';
import { Npc } from '../model/npc';
import { Player } from '../model/player';
import { Room } from '../model/room';
import { User } from '../model/user';

interface IGameService {
    createGame(users: User[], roomName: string): Game;
    startGameIfRoomIsFilled(room: Room): void;
}

class GameService implements IGameService {
    socketController: ISocketIOController;
    constructor(socketController: ISocketIOController) {
        this.socketController = socketController;
    }

    /// ゲームを作成、初期化する
    createGame(users: User[], roomName: string): Game {
        assert(users.length === 2);
        const player1 = new Player(users[0], { row: 1, column: 1 }, 'down');
        const player2 = new Player(users[1], { row: 8, column: 8 }, 'down');
        const npc = new Npc('鬼', { row: 1, column: 8 }, 'down');

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
            const socket = this.socketController.getSocketWithSid(socketId);
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

    /// roomが定員に達していればゲームを作成、
    /// currentGameに入れてスタートする
    startGameIfRoomIsFilled(room: Room): void {
        if (room.state === 'Fulfilled') {
            const game = this.createGame(room.getUsers(), room.roomname);
            room.currentGame = game;
            game.start();
        }
    }
}

export { IGameService, GameService };
