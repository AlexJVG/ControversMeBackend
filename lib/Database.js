const fs = require('fs');
const path = require('path');

class Database {

	constructor() {

		let file = JSON.parse( fs.readFileSync( path.join(__dirname, 'database.json') ));
		this.users = file.users;

	}

	save() {
		fs.writeFileSync(JSON.stringify({
			users: this.users
		}));
	}

	addNewUser(first_name, last_name, email, bio, password) {

		if (!this.doesUserExist(email)) {
			
			chats[email] = {
				first_name,
				last_name,
				username,
				email,
				bio,
				password,
				points: 0
			}

		}

		this.save();
	}


	doesUserExist(email) {
		return !!users[email];
	}

}

module.exports = Database;
