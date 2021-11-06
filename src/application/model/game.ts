import { Field } from './field';
import { Player, PlayerBase } from './player';
import { Npc } from './npc';
import { Position } from './position';
import * as Util from '../../common/util';
import { Square } from './square';

class Game {
    public battleField: Field;
    public listOfPlayer: Player[];
    public tagger: Npc;
    public state: GameState;
    /// プレイヤーが勝った場合はここに追加しておく
    /// state === "Finish" 以外では無意味
    public winner: Player | null = null;

    /// 盤面の更新を伝えるリスナー
    private updateListener: GameUpdatedListener | null;

    private timer: NodeJS.Timer | null = null;
    private tickCount = 0;

    /// ゲームの更新間隔(ms)
    private static tickInterval = 200;
    private static maxTick = 500; // ゲームの制限時間 (*tickInterval ms)

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
            ++this.tickCount;
            console.log(`Tick ${this.tickCount}`);
            this.updateFieldData();
            // 時間が来たらゲーム終了
            if (this.tickCount >= Game.maxTick) {
                this.finishGame(null);
            }
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
        this.listOfPlayer
            // 生きているプレイヤーのみ
            .filter((p) => p.status === 'alive')
            // 実際に進む方向を計算する
            .map((p) => {
                const actualDirection = this.calcActualDirection(p);
                return { p, actualDirection };
            })
            // 進む場所ごとにまとめる
            .reduce((map, value) => {
                const { p, actualDirection } = value;
                let target: Position;
                if (actualDirection !== 'stay') {
                    target = p.getAmbientSquaresPosition()[actualDirection];
                } else {
                    target = p.position;
                }
                const list = map.get(
                    this.battleField.squares[target.row][target.column]
                );
                if (list) {
                    list.push(value);
                } else {
                    map.set(
                        this.battleField.squares[target.row][target.column],
                        [value]
                    );
                }
                return map;
            }, new Map<Square, { p: Player; actualDirection: RelativeDirection }[]>())
            .forEach((list) => {
                if (list.length === 1) {
                    // 進む場所が衝突していなければそのまま進める
                    const pastPosition = list[0].p.position;
                    list[0].p.move(list[0].actualDirection, this.battleField);
                    if (list[0].actualDirection !== 'stay') {
                        this.battleField.squares[pastPosition.row][
                            pastPosition.column
                        ].increment();
                    }
                } else {
                    // 衝突している中に動いていないものがあればそれを優先
                    const stayValue = list.find(
                        (v) => v.actualDirection === 'stay'
                    );
                    if (stayValue) {
                        stayValue.p.move(
                            stayValue.actualDirection,
                            this.battleField
                        );
                        return;
                    }
                    // あとはランダムに選ばれたものだけ進める
                    // 他は動かない
                    const { p, actualDirection } =
                        list[Util.getRandomInt(0, list.length - 1)];
                    const pastPosition = p.position;
                    p.move(actualDirection, this.battleField);
                    this.battleField.squares[pastPosition.row][
                        pastPosition.column
                    ].increment();
                }
            });

        // NPCを動かす
        const pastPosition = { ...this.tagger.position };
        this.tagger.calcNextMove(this.battleField, this.listOfPlayer);
        const actual = this.calcActualDirection(this.tagger);
        this.tagger.move(actual, this.battleField);
        if (actual !== 'stay') {
            this.battleField.squares[pastPosition.row][
                pastPosition.column
            ].increment();
        }

        // プレイヤーが死んだらゲーム終了
        let deadFlag = false;
        this.listOfPlayer.forEach((p) => {
            if (
                Util.calcDistance(p.position, this.tagger.position) <= 1 &&
                this.isReachable(p.position, this.tagger.position)
            ) {
                p.status = 'dead';
                console.log(`${p.name} is dead`);
                deadFlag = true;
            } else if (p.status === 'dead') {
                deadFlag = true;
            }
        });
        if (deadFlag) {
            const alivePlayer = this.listOfPlayer.find(
                (p) => p.status === 'alive'
            );
            this.finishGame(alivePlayer ?? null);
        }
    }

    /// playerが指定した方向に移動可能かどうか、
    /// 不可能であればどの方向に動くのかを計算する
    /// playerは関数内で不変
    private calcActualDirection(player: PlayerBase): RelativeDirection {
        const { forward, left, right } = player.getAmbientSquaresPosition();
        if (this.isReachable(player.position, forward)) {
            return 'forward';
        }
        const leftIsReachable = this.isReachable(player.position, left);
        const rightIsReachable = this.isReachable(player.position, right);
        if (leftIsReachable && rightIsReachable) {
            return Util.getRandomInt(0, 2) === 0 ? 'left' : 'right';
        }
        if (leftIsReachable) {
            return 'left';
        }
        if (rightIsReachable) {
            return 'right';
        }
        return 'stay';
    }

    /// targetにコマが到達可能かどうか
    /// 落ちるとしてもそれは到達可能
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
        // 2個以上高い場合は到達不可
        return targetSquare.height - currentSquare.height <= 1;
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

    finishGame(winner: Player | null): void {
        this.winner = winner;
        this.state = 'Finish';
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
