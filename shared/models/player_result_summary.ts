export default class PlayerResultSummary {
    playerId: string | number;
    score: number;

    constructor(_playerId: string | number, _score: number) {
        this.playerId = _playerId;
        this.score = _score;
    }
}