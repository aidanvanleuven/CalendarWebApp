var db = require('diskdb');
var compression = require('compression');
var express = require('express');
var app = express();

db = db.connect("C:/Users/Aidan/Documents/Development/CalendarTestDynamic", ['db']);

app.use(compression());
app.use(express.static('public'));

//CRUD Methods!!! Hallelujah



var server = app.listen(3000);