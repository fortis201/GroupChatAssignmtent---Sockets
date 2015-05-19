var express = require("express");
var app = express();

app.set('view engine', 'ejs');
app.get('/', function (req, res) {
	res.render('index');
});

var server = app.listen(1232, function() {
	console.log("listening to port 1232");
});

var users = {};

var io = require('socket.io'). listen(server);
io.sockets.on('connection', function (line) {
	line.on("new_user", function(data) {
		console.log(data.name+" SIGNED IN");
		users[line.id] = data.name;
		line.broadcast.emit("user_signed_in", {message:"User "+data.name+" signed in."});
		io.emit("start_chat", {username: data.name});		
	});
	line.on("user_message", function(data) {
		console.log(data.username+" POSTED '"+data.message+"'");
		io.sockets.emit("message", {from: data.username, output: data.message});
	});
	line.on('disconnect', function () {
		var leaving_user = users[line.id];
		console.log(leaving_user+" LEFT CHAT");
		line.broadcast.emit("user_left_chat", {message:"User "+leaving_user+" has left the chat."});
		delete users[line.id];
	});
});