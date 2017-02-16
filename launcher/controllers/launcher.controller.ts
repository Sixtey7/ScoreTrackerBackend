import {
    GameList,
    IGameResultModel,
    IPlayerResult,
} from '../../shared/shared';

import {
    IAgricolaPlayerResultModel,
    IAgricolaGameResultModel,
    AgricolaController
} from '../../agricola/agricola';

import { StandardController } from '../../standard/standard';

import parallel = require('async/parallel');

import LauncherResult from '../models/launcher_result';

export default class LauncherController {
    
    private standardController: StandardController;
    private agricolaController: AgricolaController;

    constructor() {
        this.standardController = new StandardController();
        this.agricolaController = new AgricolaController();
    }
    
    public getAll() : Promise<LauncherResult> {
        return new Promise<LauncherResult>((resolve, reject) => {
            parallel({
                standard: (callback) => {
                    this.standardController.getAllGames()
                        .then(response => callback(null, response))
                        .catch(err => callback(err, null));
                },
                agricola: (callback) => {
                    this.agricolaController.test()
                        .then(response => callback(null, response))
                        .catch(err => callback(err, null));
                },
                players: (callback) => {
                    this.standardController.getAllPlayers()
                        .then(response => callback(null, response))
                        .catch(err => callback(err, null));
                }
            },
                function(err, results) {
                    console.log('---------------------------------------------');
                    console.log('ASYNC RESOLVED!!!!!!');
                    console.log(JSON.stringify(results));
                    console.log('---------------------------------------------');

                    for (let x: number = 0; x < results.length; x++) {
                        console.log(typeof results[x]);
                    }

                    let response: LauncherResult = new LauncherResult();
                    response.standardGames = results['standard'];
                    response.agricolaGames = results['agricola'];
                    response.players = results['players'];
                    resolve(response);
                }
            );
        });
    }
}