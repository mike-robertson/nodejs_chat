
var sendMessage = function() {
	var messageText = $('#messageText').val();
	if(messageText)
	{
		socket.emit('chat', userName, messageText);
		// $('.chatWindow>ul').append($('<li>').append($('<div class="chatUserYou">').text('you:').append($('<div class="chatMessage">').text( + $('#m').val()));
		
    	// $('.chatWindow>ul').append($('<li>').text('you: ' + $('#m').val()));
    	$('.chatWindow ul').append('<li class=\'chatText wordwrap\'><span class=\'chatTestUser You\'>' + userName + ' (you)</span>: ' + messageText + '</li>');
		$('#messageText').val('');
		$('.chatWindow').scrollTop($('.chatWindow').prop('scrollHeight'));
	}
};


var newUserJoin = function(newUser, thisClient) {

	if(thisClient)
		$('.chatUsers ul').append('<li class=\'userName wordwrap You\'>' + newUser + '</li>');
	else {
		$('.chatUsers ul').append('<li class=\'userName wordwrap\'>' + newUser + '</li>');
    	$('.chatWindow ul').append('<li class=\'chatText wordwrap serverMessage\'>' + newUser + ' joined the chat.</li>');
    }
};

var userLeft = function(discUser) {
	$('.chatWindow ul').append('<li class=\'chatText wordwrap serverMessage\'>' + discUser + ' has left.</li>');
	$('.chatUsers ul li').filter(function() { return $.text([this]) === discUser;})[0].remove();
};

var inputChat = function(user, msg) {
    $('.chatWindow ul').append('<li class=\'chatText wordwrap\'><span class=\'chatTestUser\'>' + user + '</span>: ' + msg + '</li>');
	$('.chatWindow').scrollTop($('.chatWindow').prop('scrollHeight'));
};