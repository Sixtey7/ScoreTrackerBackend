import PlayerResultSummary from './player_result_summary';
import { GameList } from '../shared';

export default class GameResultSummary {
    _id: string | number;
    gameDefId: string | number;
    date: Date;
    playerResults: PlayerResultSummary[];

    constructor(_id: string | number, _gameDefId: string | number, _date: Date) {
        this._id = _id;
        this.gameDefId = _gameDefId;
        this.date = _date;
        this.playerResults = new Array<PlayerResultSummary>();
    }
}