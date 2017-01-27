import PlayerResult from './player_result';
import Player from './player';
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

    public updateScoreForPlayer(_player: Player, _score: number) {
        return this.updateScoreForPlayerId(_player.getId(), _score);
    }

    public updateScoreForPlayerId(_playerId: number, _score: number) {
        let returnResult: boolean = false;

        //TODO: making this a map or something might make this quicker
        for (let playerResult of this.playerResults) {
            if (_playerId === playerResult.getPlayerId()) {
                console.log('Found the player by id! Updating the score');
                playerResult.setScore(_score);
                returnResult = true;
                break;
            }
        }

        return returnResult;
    }
}

