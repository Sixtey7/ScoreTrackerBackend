import * as mongoose from 'mongoose';

import { agricolaPlayerResultSchema, IAgricolaPlayerResultModel } from './agricola_player_result';
import { GameList } from '../../shared/shared';

interface IAgricolaGameResult {
    game: GameList;
    date: Date;
    playerResults: IAgricolaPlayerResultModel[];
}

interface IAgricolaGameResultModel extends IAgricolaGameResult, mongoose.Document{}

var agricolaGameResultSchema = new mongoose.Schema({
    game: String,
    date: { type: Date, default: Date.now },
    playerResults: [agricolaPlayerResultSchema]
});

var AgricolaGameResult = mongoose.model<IAgricolaGameResultModel>("AgricolaGameResult", agricolaGameResultSchema);

export { AgricolaGameResult, IAgricolaGameResultModel };