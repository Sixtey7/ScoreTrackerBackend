import express = require('express');

import LauncherController from '../controllers/launcher.controller';

export default class LauncherRoutes {
    private controller: LauncherController;

    constructor(app: express) {
        this.controller = new LauncherController();

        this.configureRoutes(app);
    }

    private configureRoutes(app: express) {
        app.get('/launcher/test', (req: express.Request, res: express.Response) => {
            this.controller.getAll()
                .then(response => {
                    res.status(200).send(response);
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });
    }
}