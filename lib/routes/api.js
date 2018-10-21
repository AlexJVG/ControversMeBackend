const express = require('express');
const router = express.Router();

const HttpToken = require('../security/HttpToken.js');
const Database = require('../Database.js');
const Security = require('../security/Security.js');

const tokenGen = new HttpToken('gK84Am3qPbNLerCffjKsmjUNr7Vn3jhe', 'Yh4WgbDeZJvS5hbL', 'waterypotatoes337');
const database = new Database();

const responses = require('../responses.js');

router.post('*', (req, res, next) => {

	if (req.originalUrl === '/api/create-account' || req.originalUrl === '/api/login') {
		return next();
	} else if (req.body.token) {
		req.tokenData = tokenGen.verifyAndDecrypt(req.body.token);
		if (req.tokenData) {
			return next();
		}
	}

	res.send(responses.error(403));

});


router.post('/create-account', async (req, res) => {

	let firstName = req.body.first_name;
	let lastName = req.body.last_name;
	let username = req.body.username;
	let email = req.body.email;
	let bio = req.body.bio;
	let password = req.body.password;


	if (firstName && lastName && username && bio && password) {

		let salt = Security.getRandomString(16);
		password = await Security.hashPassword(password, salt);

		if (database.addNewUser(firstName, lastName, username, email, bio, password, salt)) {
			res.send(responses.success());
		} else {
			res.send(responses.error('user_already_exists'));
		}

	} else {
		res.send(responses.error('bad_data'));
	}

});

router.post('/login', async (req, res) => {
	let email = req.body.email;
	let password = req.body.password;

	if (email && password) {
		let user = database.getUser(email);
		if (user) {
			let good = await Security.verifyPassword(password, user.salt, user.password);

			if (good) {
				res.send(responses.success({
					token: tokenGen.generateToken({ email: user.email })
				}));
			} else {
				res.send(responses.error('bad_creds'));
			}

		} else {
			res.send(responses.error('bad_creds'));
		}
	}

});

router.post('/get-user-data', (req, res) => {
	if (req.tokenData.email) {
		let email = req.tokenData.email;

		if (database.doesUserExist(email)) {
			return res.success(database.getUser(email));
		}

	}
});

router.get('/rooms', (req, res) => {
	let rooms = database.getAllRooms();

	for (let room in rooms) {
		if (!rooms.hasOwnProperty(room))
			continue;
		delete room.aliases;
	}

	res.send( responses.success(rooms) );
});


router.post('/create-room', (req, res) => {

	if (req.tokenData.email) {
		let name = req.body.name;
		let id = Security.getRandomString(16);

		database.createRoom(id, name, req.tokenData.email);

		res.send( responses.success({ id }) );
	}

});

router.post('/get-old-chats', (req, res) => {
	let room = req.body.room;

	if (database.isRoom(room)) {
		let chats = database.getChats(room);
		let map = database.getRoom(room).aliases;


		for (let i = 0; i < chats.length; i++) {
			if (map[chats[i].from]) {
				chats[i].from = map[chats[i].from];
			}
		}

		res.send( responses.success(chats) );

	} else {
		res.send( responses.error('not_a_room') );
	}

});

router.post('/vote-for-person', (req, res) => {
	let room = req.body.room;
	let toVoteFor = req.body.toVoteFor;

	if (database.isADebator(room, toVoteFor)) {
		database.upvoteDebator(room, toVoteFor);
		res.send(responses.success());
	}

	res.send(responses.error('bad_data'));

});

router.post('/get-room-info', (req, res) => {
	let room = req.body.room;

	if (database.isRoom(room)) {
		let room = database.getRoom(room);
		delete room.aliases;
	}

	res.send(responses.error('bad_data'));
});


function socketResponse(io) {
	return (socket) => {
		socket.on('join-room', val => {
			let tokenData = tokenGen.verifyAndDecrypt(val.token);

			if (typeof tokenData === 'object' && tokenData.email && database.isRoom(val.room)) {
				socket.join(val.room);

				let room = database.getRoom(val.room);

				if () {
					
				}

				database.createNickname(val.room, tokenData.email, val.nickname);

				socket.to(val.room).emit('users-changed', {user: val.nickname, event: 'joined'});
			}

		});

		socket.on('add-message', val => {
			console.log('send message', val.text);
			let tokenData = tokenGen.verifyAndDecrypt(val.token);

			if (val.room && val.nickname && tokenData && val.text) {
				socket.join(val.room);

				database.recordChat(val.room, tokenData.email, val.text);

				socket.emit('new-live-message', {text: val.text, from: val.nickname});
				socket.to(val.room).emit('new-live-message', {text: val.text, from: val.nickname});

				console.log('message has been sent', val.text, val.nickname);

			}

		});

		socket.on('leave-room', val => {
			socket.leave(val.room);
			socket.to(val.room).emit('users-changed', {user: val.nickname, event: 'left'});   
		});

	}

}

module.exports = { router, socketResponse };
