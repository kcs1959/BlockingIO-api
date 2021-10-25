import { Field } from './field';
import { Player } from './player';
import { Npc } from './npc';
import { Position } from './position';

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
            const pastPosition = { ...p.position };
            const actualDirection = this.calcActualDirection(p);
            p.move(actualDirection);
            // 移動していたら前にいた場所の高さを増やす
            if (actualDirection !== 'stay') {
                this.battleField.squares[pastPosition.row][
                    pastPosition.column
                ].increment();
            }
        });
    }

    private calcActualDirection(player: Player): RelativeDirection {
        const { forward, left, right } = player.getAmbientSquaresPosition();
        if (this.isReachable(player.position, forward)) {
            return 'forward';
        }
        const leftIsReachable = this.isReachable(player.position, left);
        const rightIsReachable = this.isReachable(player.position, right);
        if (leftIsReachable && rightIsReachable) {
            return this.getRandomInt(0, 2) === 0 ? 'left' : 'right';
        }
        if (leftIsReachable) {
            return 'left';
        }
        if (rightIsReachable) {
            return 'right';
        }
        // inverse direction
        switch (player.direction) {
            case 'up':
                player.direction = 'down';
                break;
            case 'down':
                player.direction = 'up';
                break;
            case 'left':
                player.direction = 'right';
                break;
            case 'right':
                player.direction = 'left';
                break;
        }
        return 'stay';
    }

    // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    private getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }

    private isReachable(current: Position, target: Position): boolean {
        if (
            target.row < 0 ||
            target.row >= this.battleField.length ||
            target.column < 0 ||
            target.column >= this.battleField.length
        ) {
            return false;
        }
        const currentSquare =
            this.battleField.squares[current.row][current.column];
        const targetSquare =
            this.battleField.squares[target.row][target.column];
        return Math.abs(currentSquare.height - targetSquare.height) <= 1;
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

type RelativeDirection = 'forward' | 'left' | 'right' | 'stay';

type GameUpdatedListener = (game: Game) => void;

type GameState =
    | 'BeforeStart' // ゲーム開始前
    | 'PendingStart' // ゲーム開始待ち
    | 'InGame' // ゲーム中
    | 'Finish' // ゲームが正常終了した場合
    | 'AbnormalEnd'; // ユーザが退出するなどの理由でゲームが終了した場合

export { Game, Direction, RelativeDirection, GameUpdatedListener };
