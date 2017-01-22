import PlayerResult from './player_result';
import { GameList } from '../enums/game_list.enum';

export default class GameResult {
    private id: number;
    private game: GameList;
    private playerResults: PlayerResult[];

    constructor(_id: number, _game: GameList) {
        this.id = _id;
        this.game = _game;
        this.playerResults = new Array<PlayerResult>();
    }

    public getId(): number {
        return this.id;
    }

    public setGame(_game: GameList) {
        this.game = _game;
    }

    public getGame(): GameList {
        return this.game;
    }

    public addPlayerToGame(_playerResult: PlayerResult) {
        this.playerResults.push(_playerResult);
    }
}

