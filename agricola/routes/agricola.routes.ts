import express = require('express');
import {
    Player,
    PlayerResult,
    GameResult
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

            let gameResult: GameResult = this.controller.startGame();
            //TODO: do something!

            res.status(200).send(gameResult.getId);
        });

        app.get('/agricola/currentScores', (req: express.Request, res: express.Response) => {
            let playerOne: Player = new Player(12345, 'hello');
            let playerResultOne: PlayerResult = new PlayerResult(playerOne);
            
            playerResultOne.setScore(1234);

            let playerTwo: Player = new Player(67890, 'goodbye');
            let playerResultTwo: PlayerResult = new PlayerResult(playerTwo);

            playerResultTwo.setScore(1235);

            let gameScore: any[] = new Array();
            gameScore.push(playerResultOne);
            gameScore.push(playerResultTwo);

            res.status(200).json(gameScore);
        });

        app.put('/agricola/addPlayer', (req: express.Request, res: express.Response) => {
            //TODO: do something!
            if (req.query.gameId !== undefined) {
                if (req.query.playerName !== undefined) {
                    let newPlayer = this.controller.addPlayer(req.query.gameId, req.query.playerName);
                    
                    res.status(200).json(newPlayer);
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
            //TODO: do stuff
            res.status(200).end();
        });

        app.post('/agricola/saveSession', (req:express.Request, res: express.Response) => {
            //TODO: do stuff
            res.status(200).end();
        })
    }   
}