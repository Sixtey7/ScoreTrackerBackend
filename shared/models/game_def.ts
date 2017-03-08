import * as mongoose from 'mongoose';

import { gameDefExpansionSchema, IGameDefExpansionModel } from './game_def_expansion';

interface GameDef {
    name: string,
    expansions: IGameDefExpansionModel[];
}

interface IGameDefModel extends mongoose.Document{}

var gameDefSchema = new mongoose.Schema({
    name: String,
    expansions: [gameDefExpansionSchema]
});

var GameDef = mongoose.model<IGameDefModel>("GameDef", gameDefSchema);

export {
    GameDef,
    IGameDefModel
};