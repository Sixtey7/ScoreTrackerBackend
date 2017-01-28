import * as http from "http";
import * as url from "url";
import * as express from "express";
import * as bodyParser from "body-parser";
import errorHandler = require("errorhandler");
import methodOverride = require("method-override");
import mongodb = require('mongodb');
import AgricolaRoutes from './agricola/routes/agricola.routes';

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
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/scoretracker");



//Setup the routes
new AgricolaRoutes(app);

app.listen(30000, function() {
  console.log('App listening on port 30000');
});

export var App = app;