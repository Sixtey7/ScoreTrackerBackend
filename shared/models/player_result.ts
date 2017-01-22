import Player from './player';

export default class PlayerResult {
    private player: Player;
    private score: number;

    constructor(_player: Player) {
        this.player = _player;
        this.score = 0;
    }


    getPlayer(): Player {
        return this.player;
    }

    setScore(_score: number) {
        this.score = _score;
    }

    getScore(): number {
        return this.score;
    }
}