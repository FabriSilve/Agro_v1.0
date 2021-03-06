var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

let number = 0;
let players = {};
let lord = null;


app.set('port', 5000);
console.log(__dirname);
app.use('/static', express.static(__dirname + '/static'));

app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname + '/static/index.html'));
});


/*
userModel = {
	username: string,
	date: Date,
	win: number,
	edition: Edition.Type,
}
*/

io.on('connection', socket => {

	socket.on('NEW_PLAYER', (data) => {
		players[socket.id] = {
			username: data.username,
			colors: [ 'red', 'green', 'blue'],
		};
		io.emit('USERS_UPDATED', Object.values(players));
		io.emit('NUMBER_UPDATED', { number: number, });
		console.log('New Player: ', data.username);
	});

	socket.on('INCREMENT_NUMBER', (data) => {
		number++;
		console.log(number);
		io.emit('NUMBER_UPDATED', {
			number: number,
		});
	});

	socket.on('disconnect', () => {
		console.log('Disconnect: ', players[socket.id].username);
		delete players[socket.id];
  	});
});

setInterval(() => {
	number++;
	console.log(number);
	io.emit('NUMBER_UPDATED', {
		number: number,
	});
}, 10000);


server.listen(process.env.PORT || 5000, () => console.log('Starting server on port 5000') );
