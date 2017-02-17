import {
    GameList,
    IGameResultModel,
    IPlayerResult,
    GameResultSummary
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
                    this.standardController.getAllGamesSummary()
                        .then(response => callback(null, response))
                        .catch(err => callback(err, null));
                },
                agricola: (callback) => {
                    this.agricolaController.getAllGamesSummary()
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

                    if (err) {
                        console.error('GOT AN ERROR: ' + err);
                        reject(err);
                    }

                    let response: LauncherResult = new LauncherResult();
                    response.gameResults = new Array<GameResultSummary>();
                    
                    response.gameResults = results['standard'].concat(results['agricola']);
                    response.players = results['players'];

                    resolve(response);
                }
            );
        });
    }
}