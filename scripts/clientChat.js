// Initialize the socket.io vars.
var socket = io();
var server = io.connect();

// We want all users to have a user defined name. If they decide not to have one, they will default to Anonymous.
var userName = prompt('Enter your desired user name');
if(!userName)
	userName = prompt('Are you sure you don\'t want to choose your name?');
if(!userName)
	userName = 'Anonymous';

// This tells the server we joined, and it puts our name in the users window. It then focuses the input field.
socket.emit('userJoin', userName);
newUserJoin(userName, true);
$('#messageText').focus();

// We set up a listener to call send message on keydown inside our input messageText.
$('#messageText').on('keydown', function(e) {
	if (e.which == 13 || e.keyCode == 13) {
		e.preventDefault();
		sendMessage();
	}
});

// Here we set the listeners for the socket actions. 
// There is one for users joining, one for users chatting, and one for users disconnecting.
socket.on('userJoin', function(newUser){
	newUserJoin(newUser, false);
  });

socket.on('chat', function(user, msg){
	inputChat(user, msg, false);
  });

socket.on('userDisconnect', function(discUser) {
	userLeft(discUser);
});