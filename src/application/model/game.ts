import { Field } from './field';
import { Player } from './player';
import { Npc } from './npc';

class Game {
    public battleField: Field;
    public listOfPlayer: Player[];
    public tagger: Npc;
    public state: GameState;

    /// 盤面の更新を伝えるリスナー
    private updateListener: GameUpdatedListener | null;

    constructor(battleField: Field, listOfPlayer: Player[], tagger: Npc) {
        this.battleField = battleField;
        this.listOfPlayer = listOfPlayer;
        this.tagger = tagger;
        this.updateListener = null;
        this.state = 'BeforeStart';
        console.log(`Game -> ${this.state}`);
    }

    /// ゲームを開始する
    start(): void {
        this.state = 'PendingStart';
        console.log(`Game -> ${this.state}`);
        setTimeout(() => {
            this.state = 'InGame';
            console.log(`Game -> ${this.state}`);
        }, 3000);
    }

    setUpdateListener(newListener: GameUpdatedListener): void {
        this.updateListener = newListener;
    }

    clearUpdateListener(): void {
        this.updateListener = null;
    }

    /// ユーザ側から操作を受け付ける関数
    onTryMove(userId: string, direction: Direction): void {
        if (this.state !== 'InGame') {
            console.log('ゲーム中以外での操作は受け付けられません');
            return;
        }
        const target = this.listOfPlayer.find((p) => p.uid === userId);
        if (!target) {
            console.log(`${userId}はこのゲームにいません`);
            return;
        }

        switch (direction) {
            case 'up':
                target.position.y -= 1;
                break;
            case 'down':
                target.position.y += 1;
                break;
            case 'left':
                target.position.x -= 1;
                break;
            case 'right':
                target.position.x += 1;
                break;
        }
        this.updateListener?.call(this, this);
    }

    terminate(): void {
        this.state = 'Terminated';
        console.log(`Game -> ${this.state}`);
        this.updateListener?.call(this, this);
        this.updateListener = null;
    }
}

type Direction = 'up' | 'down' | 'left' | 'right';

type GameUpdatedListener = (game: Game) => void;

type GameState =
    | 'BeforeStart'
    | 'PendingStart'
    | 'InGame'
    | 'Finish'
    | 'Terminated';

export { Game, Direction, GameUpdatedListener };
