var compression = require('compression');
var express = require('express');
var http = require('http');
var app = express();
var bodyParser = require('body-parser');
var db = require('diskdb');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

db = db.connect(__dirname, ['entries']);

//CRUD Methods

//Add entry to db
app.post('/addentry', function(req, res){
    db.entries.save(req.body);
    res.json({success: true});
});

//Get enries from db
app.post('/getentries', function(req, res){
	var foundEntries = db.entries.find({month : req.body.month});
	res.json(foundEntries);
});

//Delete an entry from db
app.post('/deleteentry', function(req,res){
	db.entries.remove(req.body, false);
	res.json({success: true});
});

//Use compression
app.use(compression());

//Spin up a server
app.use(express.static('public'));

//Listen for a packet from client; One client broadcasts to all other clients; Instant updates without refreshes
io.on('connection', function(socket){
    socket.on('month', function(msg){
    	io.emit('month', msg);
  	});
});

//Listen on port...
server.listen(3000);