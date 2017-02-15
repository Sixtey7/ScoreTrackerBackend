import {
    IPlayerModel,
    GameList
} from '../../shared/shared';

import {
    AgricolaPlayerResult,
    IAgricolaPlayerResultModel,
    AgricolaGameResult,
    IAgricolaGameResultModel
} from '../agricola';

export default class AgricolaController {
    public test() : Promise<IAgricolaGameResultModel> {
        return new Promise ((resolve, reject) => {
            let agGameResult: IAgricolaGameResultModel = new AgricolaGameResult({ game: GameList.AGRICOLA});

            let playerResult: IAgricolaPlayerResultModel = new AgricolaPlayerResult({ playerId: 1234});
            playerResult.cowNum = 5;
            playerResult.familyNum = 4;

            agGameResult.playerResults.push(playerResult);

            agGameResult.save()
                .then(response => {
                    resolve(agGameResult);
                }, err => {
                    reject (err);
                })
        });
    }
}