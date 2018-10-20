const express = require('express');

const app = express();
const path = require('path');

const server = require('http').Server(app);
const io = require('socket.io')(server);

const database = new (require('./lib/Database.js'));
const responses = require('./lib/responses.js');

const cors = require('cors');

app.use('/', express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.options('*', cors());
app.use(cors({
	origin: function (origin, callback) {
		callback(null, true)
	}
}));

app.post('/api/create-account', (req, res) => {

	console.log(req.body);

	const firstName = req.body.first_name;
	const lastName = req.body.last_name;
	const username = req.body.username;
	const email = req.body.email;
	const bio = req.body.bio;
	const password = req.body.password;

	if (firstName && lastName && username && bio && password) {
		database.addNewUser(firstName, lastName, username, email, bio, password);
		res.send(responses.success());
		
	} else {
		res.send(responses.error('user_already_exists'));
	}


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
	console.log("a new client connected");
});