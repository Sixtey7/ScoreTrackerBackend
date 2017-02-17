import PlayerResultSummary from './player_result_summary';
import { GameList } from '../shared';

export default class GameResultSummary {
    _id: string | number;
    game: GameList;
    date: Date;
    playerResults: PlayerResultSummary[];

    constructor(_id: string | number, _game: GameList, _date: Date) {
        this._id = _id;
        this.game = _game;
        this.date = _date;
        this.playerResults = new Array<PlayerResultSummary>();
    }
}