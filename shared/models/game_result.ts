import * as mongoose from 'mongoose';

import { playerResultSchema, IPlayerResultModel } from './player_result';
import { GameList } from '../enums/game_list.enum';
import { IPlayerModel } from './player';

interface IGameResult {
    game: GameList;
    date: Date;
    playerResults: IPlayerResultModel[];
}

interface IGameResultModel extends IGameResult, mongoose.Document{}

var gameResultSchema = new mongoose.Schema({
    game: String,
    date: { type: Date, default: Date.now },
    playerResults: [playerResultSchema]
});

var GameResult = mongoose.model<IGameResultModel>("GameResult", gameResultSchema);

export { GameResult, IGameResultModel };
