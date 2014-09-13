var socket = io();

var server = io.connect();

var userName = prompt('Enter your desired user name');
while(!userName)
	userName = prompt('You must enter a user name');

socket.emit('userJoin', userName);
newUserJoin(userName, true);
$('#messageText').focus();

$('#messageText').on('keydown', function(e) {
	if (e.which == 13 || e.keyCode == 13) {
		e.preventDefault();
		sendMessage();
	}
});

socket.on('userJoin', function(newUser){
	newUserJoin(newUser, false);
  });

socket.on('chat', function(user, msg){
	inputChat(user, msg);
  });

socket.on('userDisconnect', function(discUser) {
	userLeft(discUser);
});