import express = require('express');
import {
    Player,
    IPlayerModel,
    PlayerResult,
    IPlayerResultModel,
    IGameResultModel,
    GameList,
    TotalResult
} from '../../shared/shared';

import StandardController from '../controllers/standard.controller';

export default class StandardRoutes {

    private controller: StandardController;

    constructor(app: express) {
        this.controller = new StandardController();

        this.configureRoutes(app);
    }


    private configureRoutes(app: express) {
        console.log('TYPE: ' + typeof app);

        app.get('/standard/hello', (req: express.Request, res: express.Response) => {
            res.status(200).send(this.controller.sayHello());
        });

        app.put('/standard/begin', (req: express.Request, res: express.Response) => {
            console.log('Starting a game!');

            if (req.query.gameName !== undefined) {
                let gameToStart: GameList = GameList[GameList[req.query.gameName]];
                console.log('Determined the enum: ' + gameToStart.toString());
                if (gameToStart !== null) {
                    if (req.query.date !== undefined) {
                        this.controller.startGame(gameToStart, req.query.date);
                    }
                    else {
                            this.controller.startGame(gameToStart)
                                .then(response => {
                                    if (response) {
                                        res.status(200).send(response.id);
                                    }
                                    else {
                                        res.status(500).send('failed to save game in database');
                                    }
                                })
                                .catch(err => {
                                    res.status(500).send(err);
                                });
                        }
                    }
                else {
                    res.status(400).send('gameName: ' + req.query.gameName + ' was not a valid game!');
                }
            }
            else {
                res.status(400).send('gameName is a required parameter!');
            }
        });

        app.get('/standard/players', (req: express.Request, res: express.Response) => {
            console.log('returning all players!');
            if (req.query.playerIds !== undefined) {
                this.controller.getPlayers(req.query.playerIds)
                    .then(response => {
                        res.status(200).send(response);
                    })
                    .catch(err => {
                        res.status(500).send(err);
                    });
            }
            else {
                res.status(400).send('playerIds is a required parameter!');
            }
        });

        app.get('/standard/allPlayers', (req: express.Request, res: express.Response) => {
            this.controller.getAllPlayers()
                .then(response => {
                    res.status(200).send(response);
                })
                .catch(err => {
                    res.status(500).send(err);
                })
        })

        app.get('/standard/allGames', (req: express.Request, res:express.Response) => {
            this.controller.getAllGames()
                .then(response => {
                    res.status(200).send(response);
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });

        app.get('/standard/total', (req: express.Request, res: express.Response) => {
            this.controller.getAllGames()
                .then(allGames => {
                    this.controller.getAllPlayers()
                        .then(allPlayers => {
                            let returnResult: TotalResult = new TotalResult(allGames, allPlayers);
                            res.status(200).send(returnResult);
                        })
                        .catch(err => {
                            res.status(500).send(err);
                        })
                })
                .catch(err => {
                    res.status(500).send(err);
                })
        })

        app.get('/standard/currentScores', (req: express.Request, res: express.Response) => {

            if (req.query.gameId !== undefined) {
                this.controller.getScore(req.query.gameId)
                    .then(game => {
                        res.status(200).send(game);
                    })
                    .catch(err => {
                        res.status(500).send(err);
                    })
            }
            else {
                res.status(400).send('gameId is a required parameter!');
            }
        });

        app.put('/standard/addPlayer', (req: express.Request, res: express.Response) => {
            console.log('adding a player!');
            if (req.query.gameId !== undefined) {
                if (req.query.playerName !== undefined) {
                    this.controller.addPlayer(req.query.gameId, req.query.playerName)
                        .then(newPlayer => {
                            console.log('Promise resolved with new id: ' + newPlayer.id);
                            res.status(200).send(newPlayer);
                        })
                        .catch(reject => {
                            console.error('Got an error trying to save player!');
                            res.status(500).send(reject);
                        })
                }
                else {
                    res.status(400).send('playerName parameter is required!');
                }
            }
            else {
                res.status(400).send('gameId parameter is required!');
            }
        })
        .on('error', function(a, e) {
            console.log('Got an error adding a player: ' + e.message);
        });

        app.post('/standard/setScore', (req: express.Request, res: express.Response) => {
            if ((req.query.gameId !== undefined) && (req.query.playerId !== undefined) && (req.query.score !== undefined)) {
                console.log('\nSetting the score for\ngame: ' + req.query.gameId + '\nplayer: ' + req.query.playerId + '\nscore: ' + req.query.score);
                this.controller.setScore(req.query.gameId, req.query.playerId, req.query.score)
                    .then(result => {
                        if (result) {
                            res.status(200).end();
                        }
                        else {
                            console.error('got a false back from setting score using the controller');
                            res.status(500).send('failed to set score for player');
                        }
                    })
                    .catch(reject => {
                        res.status(500).send(reject);
                    });
            }
            else {
                console.log('Got the wrong params when attempting to set the score!');
                res.status(400).send('gameId, playerId, and score are all required!');
            }
        });

        app.post('/standard/save', (req:express.Request, res: express.Response) => {
            if (req.query.gameId !== undefined) {
                let newPlayerArray: IPlayerResultModel[] = req.body;
                if (newPlayerArray) {
                    console.log('Parsed the following:\n' + JSON.stringify(newPlayerArray));

                    this.controller.saveGame(req.query.gameId, newPlayerArray)
                        .then(response => {
                            res.status(200).end();
                        })
                        .catch(err => {
                            console.error('got an error from the standard controller trying to save the game\n' + err);
                            res.status(500).end();
                        })
                }
                else {
                    console.error('Failed to parse a player array in the body');
                    res.status(400).send('Could not parse the body');
                }
            }
            else {
                console.error('No gameId in request to /standard/save');
                res.status(400).send('gameId is a required parameter');
            }
        });

        app.post('/standard/addGameDef', (req:express.Request, res: express.Response) => {
            if (req.query.gameName !== undefined) {
                this.controller.addGameDef(req.query.gameName)
                    .then(response => {
                        res.status(200).end();
                    })
                    .catch(err => {
                        console.error('got an error from the standard controller trying to add a game def\n' + err);
                        res.status(500).send(err);
                    });
            }
            else {
                console.log('no game name in /standard/addGameDef');
                res.status(400).send('gameName is a required parameter');
            }
        });

        app.post('/standard/addGameDefExpansion', (req: express.Request, res: express.Response) => {
            if (req.query.gameDefId !== undefined) {
                if (req.query.expansionName !== undefined) {
                    this.controller.addExpansionToGame(req.query.gameDefId, req.query.expansionName)
                        .then(response => {
                            res.status(200).end();
                        })
                        .catch(err => {
                            console.error('got an error attempting to add expansion: ' + req.query.expansionName + ' to game def ' + req.query.gameDefId);
                            res.status(500).send(err);
                        });
                }
                else {
                    console.error('no expansionName in request to addGameDefExpansion');
                    res.status(400).send('expansionName is a required parameter!');
                }
            }
            else {
                console.error('no gameDefId in request to addGameDefExpansion');
                res.status(400).send('gameDefId is a required parameter!');
            }
        });
    } 
     
}