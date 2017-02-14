import { IPlayerModel } from './player';
import { IGameResultModel } from './game_result';

export default class TotalResult {
    private gameResults: IGameResultModel[];
    private players: IPlayerModel[];

    constructor(_gameResult: IGameResultModel[], _players: IPlayerModel[]) {
        this.gameResults = _gameResult;
        this.players = _players;
    }
}
