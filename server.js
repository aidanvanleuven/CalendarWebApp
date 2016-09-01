var compression = require('compression');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var db = require('diskdb');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

db = db.connect("C:/Users/Aidan/Documents/Development/CalendarTestDynamic", ['entries']);

//CRUD Methods
//Add entry to db

app.post('/addentry', function(req, res){
    db.entries.save(req.body);
    console.log(db.entries.count());
    res.json({success: true});
});

app.post('/getentries', function(req, res){
	var foundEntries = db.entries.find({month : req.body.month});
	console.log(db.entries.count());
	res.json(foundEntries);
});



app.use(compression());
app.use(express.static('public'));


var server = app.listen(3000);