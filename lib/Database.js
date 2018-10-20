const fs = require('fs');
const path = require('path');

class Database {

	constructor() {

		let file = JSON.parse( fs.readFileSync( path.join(__dirname, 'database.json') ));
		this.users = file.users || {};

	}

	save() {
		fs.writeFileSync(path.join(__dirname, 'database.json'), JSON.stringify({
			users: this.users
		}));
	}

	addNewUser(first_name, last_name, username, email, bio, password) {


		if (!this.doesUserExist(email)) {
			
			this.users[email] = {
				first_name,
				last_name,
				username,
				email,
				bio,
				password,
				points: 0
			}
			this.save();

			return true;
		}

		return false;
	}


	doesUserExist(email) {
		return !!this.users[email];
	}

}

module.exports = Database;
