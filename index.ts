import * as http from "http";
import * as url from "url";
import * as express from "express";
import * as bodyParser from "body-parser";
import errorHandler = require("errorhandler");
import methodOverride = require("method-override");
import mongodb = require('mongodb');
import AgricolaRoutes from './agricola/routes/agricola.routes';
import DB from './config/db';


//import * as routes from "./routes/index";
//import * as db from "./db"

let app: express = express();

//Configuration
app.use(bodyParser.urlencoded( { extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
//app.use(express.static(__dirname + '/public'));

var env = process.env.NODE_ENV || 'development';
if (env === 'development') {
  app.use(errorHandler());
}


//setup the database
let db: mongodb.Db = new DB().conn();

//Setup the routes
new AgricolaRoutes(app, db);

app.listen(30000, function() {
  console.log('App listening on port 30000');
});

export var App = app;