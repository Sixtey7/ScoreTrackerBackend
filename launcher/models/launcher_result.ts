import {
    IGameResultModel,
    IPlayerModel
} from '../../shared/shared';

import {
    IAgricolaGameResultModel
} from '../../agricola/agricola';

export default class LauncherResult {
    //TODO: We should create custom smaller objects that are just the required
    //attributes rather than sending the entire object for all games
    standardGames: IGameResultModel;
    agricolaGames: IAgricolaGameResultModel;
    players: IPlayerModel;
}