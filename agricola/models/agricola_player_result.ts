import * as mongoose from 'mongoose';
import { IPlayerResult, IPlayerResultModel } from '../../shared/shared';

interface IAgricolaPlayerResult extends IPlayerResult {
    fieldsNum: number;
    pastureNum: number;
    grainNum: number;
    vegNum: number;
    sheepNum: number;
    pigNum: number;
    cowNum: number;
    unusedNum: number;
    stableNum: number;
    clayNum: number;
    stoneNum: number;
    familyNum: number;
    cardNum: number;
    bonusNum: number;
    score: number;
}

interface IAgricolaPlayerResultModel extends IAgricolaPlayerResult, IPlayerResultModel, mongoose.Document{}
var agricolaPlayerResultSchema = new mongoose.Schema({
    fieldsNum: Number,
    pastureNum: Number,
    grainNum: Number,
    vegNum: Number,
    sheepNum: Number,
    pigNum: Number,
    cowNum: Number,
    unusedNum: Number,
    stableNum: Number,
    clayNum: Number,
    stoneNum: Number,
    familyNum: Number,
    cardNum: Number,
    bonusNum: Number,
    score: Number
});

var AgricolaPlayerResult = mongoose.model<IAgricolaPlayerResultModel>("AgricolaPlayerResult", agricolaPlayerResultSchema);

export { agricolaPlayerResultSchema, AgricolaPlayerResult, IAgricolaPlayerResultModel }