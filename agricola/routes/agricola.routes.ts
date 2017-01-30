import express = require('express');
import {
    Player,
    IPlayerModel,
    PlayerResult,
    IPlayerResultModel,
    IGameResultModel,
    GameList
} from '../../shared/shared';

import AgricolaController from '../controllers/agricola.controller';

export default class AgricolaRoutes {

    private controller: AgricolaController;

    constructor(app: express) {
        this.controller = new AgricolaController();

        this.configureRoutes(app);
    }


    private configureRoutes(app: express) {
        console.log('TYPE: ' + typeof app);

        app.get('/agricola/hello', (req: express.Request, res: express.Response) => {
            res.status(200).send(this.controller.sayHello());
        });

        app.put('/agricola/begin', (req: express.Request, res: express.Response) => {
            console.log('Starting a game!');

            this.controller.startGame(GameList.AGRCIOLA)
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
        });

        app.get('/agricola/allGames', (req: express.Request, res:express.Response) => {
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

        app.put('/agricola/addPlayer', (req: express.Request, res: express.Response) => {
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

        app.post('/agricola/setScore', (req: express.Request, res: express.Response) => {
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

        app.post('/agricola/saveSession', (req:express.Request, res: express.Response) => {
            //TODO: need to determine if this is needed, or if we'll just always be saving
            res.status(400).send('Don\'t use this!');
        })
    }  
}