import * as mongoose from 'mongoose';

import { agricolaPlayerResultSchema, IAgricolaPlayerResultModel } from './agricola_player_result';
import { GameList } from '../../shared/shared';

interface IAgricolaGameResult {
    gameDefId: string | number;
    date: Date;
    playerResults: IAgricolaPlayerResultModel[];
    expansions: string[];
}

interface IAgricolaGameResultModel extends IAgricolaGameResult, mongoose.Document{}

var agricolaGameResultSchema = new mongoose.Schema({
    gameDefId: String,
    date: { type: Date, default: Date.now },
    playerResults: [agricolaPlayerResultSchema],
    expansions: [String]
});

var AgricolaGameResult = mongoose.model<IAgricolaGameResultModel>("AgricolaGameResult", agricolaGameResultSchema);

export { AgricolaGameResult, IAgricolaGameResultModel };