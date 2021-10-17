import { Game } from '../model/game';
import { User } from '../model/user';

interface IGameService {
    createGame(users: User[]): Game;
}
