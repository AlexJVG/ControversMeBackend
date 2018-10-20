const express = require('express');
const router = express.Router();

const HttpToken = require('../security/HttpToken.js');
const Database = require('../Database.js');

const tokenGen = new HttpToken('gK84Am3qPbNLerCffjKsmjUNr7Vn3jhe', 'Yh4WgbDeZJvS5hbL', 'waterypotatoes337');
const database = new Database();

const responses = require('../responses.js');


router.post('/create-account', (req, res) => {

	let firstName = req.body.first_name;
	let lastName = req.body.last_name;
	let username = req.body.username;
	let email = req.body.email;
	let bio = req.body.bio;
	let password = req.body.password;

	console.log(req.body);

	if (firstName && lastName && username && bio && password) {
		if (database.addNewUser(firstName, lastName, username, email, bio, password)) {
			res.send(responses.success());
		} else {
			res.send(responses.error('user_already_exists'));
		}

	} else {
		res.send(responses.error('bad_data'));
	}

});


module.exports = router;

