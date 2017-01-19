import * as http from "http";
import * as url from "url";
import * as express from "express";
import * as bodyParser from "body-parser";
import errorHandler = require("errorhandler");
import methodOverride = require("method-override");

//import * as routes from "./routes/index";
//import * as db from "./db"

var app = express();

//Configuration
app.use(bodyParser.urlencoded( { extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
//app.use(express.static(__dirname + '/public'));

var env = process.env.NODE_ENV || 'development';
if (env === 'development') {
  app.use(errorHandler());
}

app.get('/testService', (req: express.Request, res: express.Response) => {
  console.log('Test Service Is Executing!');

  let testVar: string[] = [];
  testVar.push('Hello');
  testVar.push('Goodbye');


  res.write(JSON.stringify(testVar));

  res.end();
}).on('error', function(a, e) {
  console.log('Got an error: ' + e.message);
});

app.listen(30000, function() {
  console.log('App listening on port 30000');
});

export var App = app;