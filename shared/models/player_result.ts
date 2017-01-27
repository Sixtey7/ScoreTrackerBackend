import Player from './player';

export default class PlayerResult {
    private playerId: number;
    private score: number;

    constructor(_playerId: number) {
        this.playerId = _playerId;
        this.score = 0;
    }


    getPlayerId(): number {
        return this.playerId;
    }

    setScore(_score: number) {
        this.score = _score;
    }

    getScore(): number {
        return this.score;
    }
}