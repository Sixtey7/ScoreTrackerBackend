import express = require('express');
//import db = require('../db');
/*
module Route {
    export class AgricolaRoutes {
        public sayHello(req: express.Request, res: express.Reponse) {
            res.body = "hello agricola!";
        }
    }
}

export = Route;
*/


export = function(app) {
    app.get('/agricola/hello', (req: express.Request, res: express.Response) => {
        res.status(200).send('hello agricola!');
    });

    app.put('/agricola/begin', (req: express.Request, res: express.Response) => {
        console.log('Starting a game!');

        //TODO: do something!

        res.status(200).end();
    });

    app.get('/agricola/currentScores', (req: express.Request, res: express.Response) => {
        let playerOne: any = {};
        let playerResultOne: any = {};

        playerOne['id'] = 12345;
        playerOne['name'] = 'hello';
        
        playerResultOne['player'] = playerOne;
        playerResultOne['score'] = 1234;

        let playerTwo: any = {};
        let playerResultTwo: any = {};

        playerTwo['id'] = 67890;
        playerTwo['name'] = 'goodbye';

        playerResultTwo['player'] = playerTwo;
        playerResultTwo['score'] = 1235;

        let gameScore: any[] = new Array();
        gameScore.push(playerResultOne);
        gameScore.push(playerResultTwo);

        res.status(200).json(gameScore);
    });

    app.put('/agricola/addPlayer', (req: express.Request, res: express.Response) => {
        //TODO: do something!

        let playerOne: any = {};
        playerOne['id'] = 12345;
        //TODO: first step here should be to pull out the username
        playerOne['name'] = 'hello';

        res.status(200).json(playerOne);
    });
}