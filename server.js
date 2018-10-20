const express = require('express');

const app = express();
const path = require('path');

const server = require('http').Server(app);
const io = require('socket.io')(server);

const database = new (require('./lib/Database.js'));
const responses = require('./lib/responses.js');

app.use('/', express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.post('/api/create-account', (req, res) => {

	const firstName = req.body.first_name;
	const lastName = req.body.last_name;
	const username = req.body.username;
	const email = req.body.email;
	const bio = req.body.bio;
	const password = req.body.password;

	database.addNewUser(firstName, lastName, username, email, bio, password);

	res.send(responses.success());

});

app.get('/egor/:hello', (req, res) => {

	res.send(req.params.hello);

});

app.get('*', (req, res) => {
	res.send(responses.error('404 Not Found'));
});


server.listen(8080);


// io socket
io.on('connection', socket => {
	socket.on("chat message", function(msg){
		socket.broadcast.emit('chat message', msg);
		socket.emit('chat message', msg);
		console.log("send: ", msg)
	})
});