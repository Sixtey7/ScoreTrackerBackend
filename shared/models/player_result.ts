import * as mongoose from 'mongoose';

interface IPlayerResult {
    playerId: string | number;
    score: number;
}

interface IPlayerResultModel extends IPlayerResult, mongoose.Document{}
var playerResultSchema = new mongoose.Schema({
    playerId: String,
    score: Number
});

var PlayerResult = mongoose.model<IPlayerResultModel>("PlayerResult", playerResultSchema);

export { playerResultSchema, PlayerResult, IPlayerResultModel };