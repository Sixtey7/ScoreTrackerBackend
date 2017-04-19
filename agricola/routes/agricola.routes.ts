import express = require('express');
import bodyParser = require('body-parser');

import {
    IAgricolaGameResultModel,
    IAgricolaPlayerResultModel
} from '../agricola';

import AgricolaController from '../controllers/agricola.controller';




export default class AgricolaRoutes {
    private controller: AgricolaController;

    constructor(app: express) {
        this.controller = new AgricolaController();

        this.configureRoutes(app);
    }

    private configureRoutes(app: express) {
        app.use(bodyParser.json());

        app.put('/agricola/begin', (req: express.Request, res: express.Response) => {
            //TODO: Here we're cheating with the fact that IGameResultModel 
            //and IAgricolaGameResultModel have the same property names
            let bodyGame: IAgricolaGameResultModel = req.body;

            if (bodyGame) {
                this.controller.startGame(bodyGame)
                    .then(response => {
                        res.status(200).send(response.id);
                    })
                    .catch(err => {
                        console.error('Got an error attempting to start an agricola game:\n' + err);
                        res.status(500).send(err);
                    });
            }
            else {
                console.error('No Agricola Game was received in request to /agricola/begin!');
                res.status(400).send('An agricola game is required in the body!');
            }
        });

        app.get('/agricola/players', (req: express.Request, res: express.Response) => {
            if (req.query.playerIds !== undefined) {
                this.controller.getPlayers(req.query.playerIds)
                    .then(response => {
                        res.status(200).send(response);
                    })
                    .catch(err => {
                        console.error('got an error trying to get players: ' + err);
                        res.status(500).send(err);
                    });
            }
            else {
                res.status(400).send('playerIds is a required parameter!');
            }
        });

        app.get('/agricola/allGames', (req: express.Request, res: express.Response) => {
            this.controller.getAllGames()
                .then(response => {
                    res.status(200).send(response);
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });

        app.get('/agricola/currentScores', (req: express.Request, res: express.Response) => {
            if (req.query.gameId !== undefined) {
                this.controller.getScore(req.query.gameId)
                    .then(response => {
                        res.status(200).send(response);
                    })
                    .catch(err => {
                        console.error('got an error attempting to get the current scores: ' + err);
                        res.status(500).send(err);
                    });
            }
            else {
                res.status(400).send('gameId is a required parameter!');
            }
        });


        app.put('/agricola/addPlayer', (req: express.Request, res: express.Response) => {
            console.log('adding a player to an agricola game!');
            if (req.query.gameId !== undefined) {
                if (req.query.playerName !== undefined) {
                    this.controller.addPlayer(req.query.gameId, req.query.playerName)
                        .then(newPlayer => {
                            console.log('Promise resolved with new id: ' + newPlayer.id);
                            res.status(200).send(newPlayer);
                        })
                        .catch(reject => {
                            console.log('got an error trying to save player!');
                            res.status(500).send(reject);
                        });
                }
                else {
                    res.status(400).send('playerName is required!');
                }
            }
            else {
                res.status(400).send('gameId is required!');
            }
        });

        app.post('/agricola/setScore', (req: express.Request, res: express.Response) => {
            console.log('updating the score for a player in agricola!');
            if (req.query.gameId !== undefined) {
                let newPlayer: IAgricolaPlayerResultModel = req.body;
                if (newPlayer) {
                    this.controller.setScore(req.query.gameId, newPlayer)
                        .then(response => {
                            if (response) {
                                res.status(200).end();
                            }
                            else {
                                console.error('got a negative result back from setting the player\'s score');
                                res.status(500).send('failed to save player\'s score');
                            }
                        })
                        .catch(err => {
                            console.log('got an error trying to set the player\'s score' + err);
                            res.status(500).send(err);
                        });
                }  
                else {
                    console.error('body did not contain a player!');
                    res.status(400).send('body must contain an agricola player!');
                }
            }
            else {
                res.status(400).send('gameId is a required parameter!');
            }
        });

        app.post('/agricola/save', (req: express.Request, res: express.Response) => {
            if (req.query.gameId !== undefined) {
                let newPlayerArray: IAgricolaPlayerResultModel[] = req.body;
                if (newPlayerArray) {
                    console.log('Parsed the following:\n' + JSON.stringify(newPlayerArray));

                    this.controller.saveGame(req.query.gameId, newPlayerArray);
                    res.status(200).end();
                }
                else {
                    console.error('Failed to parse the new player array in the body!');
                    res.status(400).send('Failed to parse the player array!');
                }
            }
            else {
                res.status(400).send('gameId is a required parameter!');
            }
        })

    }
}
