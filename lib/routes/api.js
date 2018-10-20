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

	console.log(req.body);

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

	res.send( responses.success(database.getAllRooms()) );
});


router.post('/create-room', (req, res) => {

	if (req.tokenData.email) {
		let name = req.body.name;
		let id = Security.getRandomString();

		database.createRoom(id, name, req.tokenData.email);

		res.send( responses.success() );
	}

});

module.exports = router;

