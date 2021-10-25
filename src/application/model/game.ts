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

    private timer: NodeJS.Timer | null = null;
    private tickCount = 0;

    /// ゲームの更新間隔(ms)
    private static tickInterval = 1000;

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
            this.startTimer();
            console.log(`Game -> ${this.state}`);
        }, 3000);
    }

    private startTimer(): void {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.tickCount = 0;
        // tickIntervalごとに盤面を計算し、クライアントに通知する
        this.timer = setInterval(() => {
            console.log(`Tick ${++this.tickCount}`);
            this.updateFieldData();
            this.updateListener?.call(this, this);
        }, Game.tickInterval);
    }

    private stopTimer(): void {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.timer = null;
    }

    setUpdateListener(newListener: GameUpdatedListener): void {
        this.updateListener = newListener;
    }

    clearUpdateListener(): void {
        this.updateListener = null;
    }

    /// 盤面の情報を進める
    private updateFieldData(): void {
        //ユーザを動かす
        this.listOfPlayer.forEach((p) => {
            switch (p.direction) {
                case 'up':
                    p.position.row -= 1;
                    break;
                case 'down':
                    p.position.row += 1;
                    break;
                case 'left':
                    p.position.column -= 1;
                    break;
                case 'right':
                    p.position.column += 1;
                    break;
            }
        });
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
        // ここではユーザの操作のみを登録する
        // 実際の移動処理は[updateFieldData]で行う
        target.direction = direction;
    }

    /// ゲームを強制終了する
    terminate(): void {
        this.state = 'AbnormalEnd';
        console.log(`Game -> ${this.state}`);
        this.stopTimer();
        this.updateListener?.call(this, this);
        this.updateListener = null;
    }
}

type Direction = 'up' | 'down' | 'left' | 'right';

type GameUpdatedListener = (game: Game) => void;

type GameState =
    | 'BeforeStart' // ゲーム開始前
    | 'PendingStart' // ゲーム開始待ち
    | 'InGame' // ゲーム中
    | 'Finish' // ゲームが正常終了した場合
    | 'AbnormalEnd'; // ユーザが退出するなどの理由でゲームが終了した場合

export { Game, Direction, GameUpdatedListener };
