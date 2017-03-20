import * as mongoose from 'mongoose';

import { gameDefExpansionSchema, IGameDefExpansionModel } from './game_def_expansion';
import { ScoringType } from '../../shared/shared';

interface IGameDef {
    name: string;
    scoringType: ScoringType,
    expansions: IGameDefExpansionModel[];
}

interface IGameDefModel extends IGameDef, mongoose.Document{}

var gameDefSchema = new mongoose.Schema({
    name: String,
    scoringType: String,
    expansions: [gameDefExpansionSchema]
});

var GameDef = mongoose.model<IGameDefModel>("GameDef", gameDefSchema);

export {
    GameDef,
    IGameDefModel
};