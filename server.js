const express = require('express');
const app = express();
const path = require('path')
//const http = require('http').Server(app)
const io = require('socket.io');
const public = path.join(__dirname, 'public')
const database = new (require('./lib/Database.js'));
const responses = require('./lib/responses.js');

app.use("/", express.static(public));

app.use(express.json());

app.post('/api/create-account', (req, res) => {

	const firstName = req.body.first_name;
	const lastName = req.body.last_name;
	const email = req.body.email;
	const bio = req.body.bio;

	database.addNewUser(firstName, lastName, email, bio);

	res.send(responses.success());

});

app.get('/egor/:hello', (req, res) => {

	res.send(req.params.hello);

});

app.get('*', (req, res) => {
	res.send(responses.error('404 Not Found'));
});

app.listen(8080);


//io socket

io.socket.on('connection', function(socket){
	console.log("a new client connected")
})