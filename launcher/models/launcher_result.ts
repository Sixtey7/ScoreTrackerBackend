import {
    GameResultSummary,
    IPlayerModel
} from '../../shared/shared';

export default class LauncherResult {
    gameResults: GameResultSummary[];
    players: IPlayerModel[];
}