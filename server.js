var express = require("express");
var app = express();

app.set('view engine', 'ejs');
app.get('/', function (req, res) {
	res.render('index');
});

var server = app.listen(1232, function() {
	console.log("listening to port 1232");
});

var io = require('socket.io'). listen(server);
io.sockets.on('connection', function (line) {
	console.log("Initiating communication line...");
	console.log("Line established, please stand by for instructions...");	
	line.on("new_user", function(data) {
		console.log("User "+data.name+" signed in.");
		line.broadcast.emit("user_signed_in", {message:"User "+data.name+" signed in."});
		io.emit("start_chat", {username: data.name});		
	});
	line.on("user_message", function(data) {
		console.log("we are here "+ data.username+" "+data.message);
		io.sockets.emit("message", {from: data.username, output: data.message});
	});
});