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

app.post('/getentries', function(req, res){
	var foundEntries = db.entries.find({month : req.body.month});
	res.json(foundEntries);
});

app.post('/deleteentry', function(req,res){
	db.entries.remove(req.body, false);
	res.json({success: true});
});

app.use(compression());
app.use(express.static('public'));

io.on('connection', function(socket){
    socket.on('success', function(){
    	console.log("Send refresh to all clients");
    	io.emit('refresh');
  	});
});


server.listen(3000);