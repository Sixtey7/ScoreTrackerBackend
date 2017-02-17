import {
    IPlayerModel,
    GameList,
    GameResultSummary,
    PlayerResultSummary
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

    public getAllGamesSummary(): Promise<GameResultSummary[]> {
        return new Promise((resolve, reject) =>  {
            AgricolaGameResult.find({}, {_id: 1, game: 1, date: 1, 'playerResults.playerId': 1}, function(err, games) {
                if (err) {
                    console.log('Got an error trying to get a subset of params: ' + err);
                    reject(err);
                }

                if (games) {
                    let returnVal: GameResultSummary[] = new Array<GameResultSummary>();
                    for (let x: number = 0; x < games.length; x++) {
                        let newVal: GameResultSummary = new GameResultSummary(games[x].id, games[x].game, games[x].date);
                        for (let y = 0; y < games[x].playerResults.length; y++) {
                            newVal.playerResults.push(new PlayerResultSummary(games[x].playerResults[y].playerId));
                        }

                        returnVal.push(newVal);
                    }

                    resolve(returnVal);
                }
                else {
                    reject('No results found');
                }
            })
        })    
    }

}