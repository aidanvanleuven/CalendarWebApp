var compression = require('compression');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var db = require('diskdb');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

db = db.connect(__dirname, ['entries']);

//CRUD Methods
//Add entry to db

app.post('/addentry', function(req, res){
    db.entries.save(req.body);
    console.log(db.entries.count());
    res.json({success: true});
});

app.post('/getentries', function(req, res){
	var foundEntries = db.entries.find({month : req.body.month});
	res.json(foundEntries);
});

app.post('/deleteentry', function(req,res){
	db.entries.remove(req.body, false);
	res.json({success: true});
});

console.log(db.entries.count({day : "1"}));

app.use(compression());
app.use(express.static('public'));


var server = app.listen(3000);