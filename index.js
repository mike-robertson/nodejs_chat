var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongojs = require('mongojs');


// Connection info and setup
var dbUser = 'testUser';
var dbPassword = 'testpass';
var uri = 'mongodb://' + dbUser + ':' + dbPassword + '@ds035240.mongolab.com:35240/node_chat';
var db = mongojs.connect(uri);
var chatLogs = db.collection('chatLogs');
var users = db.collection('users');


// Tell express to be able to get styles and jscripts for index.html
app.use("/css", express.static(__dirname + '/css'));
app.use("/scripts", express.static(__dirname + '/scripts'));

// Set the default to send our homepage.
var options = {root: __dirname};
app.get('/', function(req, res){
	res.sendFile('index.html', options);
});

// Whenever we fire up the server, we want to delete all the users, as if the server is shut down, it doesn't properly clean up the table.
users.remove({}, function(err, doc) {
	if(err)
		console.log('failed to delete');
	else
		console.log('deleted user');
});


io.on('connect', function(socket){

	// On connect, we want to fill up a new users chat log and the users window with what is in the db.
	// Currently, we don't care about the age of the messages, we send them all.
	chatLogs.find().sort({timeStamp: -1}, function(err, docs) {
		docs.forEach(function(msg) {
			socket.emit('chat', msg.user, msg.message);
		});
	});

	users.find().sort({timeStamp: 1}, function(err, docs) {
		docs.forEach(function(u) {
			socket.emit('userJoin', u.user);
		});
	});

	// Whenever a user joins and has picked a name, they fire this which adds their name to the users window.
	socket.on('userJoin', function(user) {
    	var escapedUser = user.replace('<', '').replace('>', '');
		users.save({'user': escapedUser});
		socket.broadcast.emit('userJoin', escapedUser);
		socket.userName = escapedUser;
	});

	// This broadcasts chats from users and saves the message to the db.
	socket.on('chat', function(user, msg){
    	// I'm too lazy to try to stop html injection more thoroughly.
    	var escapedUser = user.replace('<', '').replace('>', '');
    	var escapedMsg = msg.replace('<', '').replace('>', '');
    	socket.broadcast.emit('chat', escapedUser, escapedMsg);

		chatLogs.save({'user': escapedUser, 'message': escapedMsg});
	});

	// When a user disconnects, this will remove 1 instance of that user name from the list, and it will tell
	// other clients to remove 1 instance of the user name from ther user window.
	socket.on('disconnect', function() {
		socket.broadcast.emit('userDisconnect', socket.userName);
		users.remove({'user': socket.userName}, {justOne: true}, function(err, doc) {
			if(err)
				console.log('failed to delete ' + doc.user);
			else
				console.log('deleted user ' + doc.user);
		});
	});

});

// Tell our server to listen on port 3000.
http.listen(3000, function(){
	console.log('listening on *:3000');
});