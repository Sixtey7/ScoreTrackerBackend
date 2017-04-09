import * as mongoose from 'mongoose';

import { playerResultSchema, IPlayerResultModel } from './player_result';
import { GameList } from '../enums/game_list.enum';
import { IPlayerModel } from './player';

interface IGameResult {
    gameDefId: string | number;
    date: Date;
    playerResults: IPlayerResultModel[];
    expansions: string[];
}

interface IGameResultModel extends IGameResult, mongoose.Document{}

var gameResultSchema = new mongoose.Schema({
    gameDefId: String,
    date: { type: Date, default: Date.now },
    playerResults: [playerResultSchema],
    expansions: [String]
});

var GameResult = mongoose.model<IGameResultModel>("GameResult", gameResultSchema);

export { GameResult, IGameResultModel };
