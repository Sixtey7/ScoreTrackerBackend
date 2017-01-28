export default class PlayerResult {
    private playerId: string | number;
    private score: number;

    constructor(_playerId: string | number) {
        this.playerId = _playerId;
        this.score = 0;
    }


    getPlayerId(): string | number{
        return this.playerId;
    }

    setScore(_score: number) {
        this.score = _score;
    }

    getScore(): number {
        return this.score;
    }
}