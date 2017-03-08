import * as mongoose from 'mongoose';

interface IGameDefExpansion {
    name: string;
}

interface IGameDefExpansionModel extends mongoose.Document{}
var gameDefExpansionSchema = new mongoose.Schema({
    name: String
});

var GameDefExpansion = mongoose.model<IGameDefExpansionModel>("GameDefExpansion", gameDefExpansionSchema);
export {
    IGameDefExpansion,
    gameDefExpansionSchema,
    GameDefExpansion,
    IGameDefExpansionModel
};