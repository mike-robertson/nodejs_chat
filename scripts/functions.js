// These are our functions to handle the events.

// When a user joins, we insert the users name into the users window, and then we insert a server message
// saying that the new user joined the chat.
// Since we use broadcast in our server, we call this manually for the user who joined.
var newUserJoin = function(newUser, thisClient) {

	if(thisClient)
		$('.chatUsers ul').append('<li class=\'userName wordwrap You\'>' + newUser + '</li>');
	else {
		$('.chatUsers ul').append('<li class=\'userName wordwrap\'>' + newUser + '</li>');
    	$('.chatWindow ul').append('<li class=\'chatText wordwrap serverMessage\'>' + newUser + ' joined the chat.</li>');
    }
};

// Whenever we want to send a message, this is called. It pulls the message text and tells the server who broadcasts it.
// The message sender inserts his own message without going through the server. The input is reset.
var sendMessage = function() {
	var messageText = $('#messageText').val();
	if(messageText)
	{
		socket.emit('chat', userName, messageText);
		inputChat(userName, messageText);
    	$('#messageText').val('');
	}
};

// Whenever we get a new message, we insert it into our chatWindow list.
var inputChat = function(user, msg) {
    $('.chatWindow ul').append('<li class=\'chatText wordwrap\'><span class=\'chatTestUser\'>' + user + '</span>: ' + msg + '</li>');
	$('.chatWindow').scrollTop($('.chatWindow').prop('scrollHeight'));
};

// Whenever a user leaves, we call this function. It removes 1 instance of that user from the users window.
var userLeft = function(discUser) {
	$('.chatWindow ul').append('<li class=\'chatText wordwrap serverMessage\'>' + discUser + ' has left.</li>');
	$('.chatUsers ul li').filter(function() { return $.text([this]) === discUser;})[0].remove();
};
