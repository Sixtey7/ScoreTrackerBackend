"use strict";
var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
