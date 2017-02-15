import express = require('express');

import {
    IAgricolaGameResultModel
} from '../agricola';

import AgricolaController from '../controllers/agricola.controller';

export default class AgricolaRoutes {
    private controller: AgricolaController;

    constructor(app: express) {
        this.controller = new AgricolaController();

        this.configureRoutes(app);
    }

    private configureRoutes(app: express) {
        app.get('/agricola/test', (req: express.Request, res: express.Response) =>{
            this.controller.test()
                .then(response => {
                    res.status(200).send(response);
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });
    }
}