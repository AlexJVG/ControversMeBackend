const fs = require('fs');

class Database {

	constructor() {

		let file = JSON.parse( fs.readFileSync('./databse.json') );
		this.users = file.users;

	}

	save() {
		fs.writeFileSync(JSON.stringify({
			users: this.users
		}));
	}

	addNewUser(first_name, last_name, email, bio) {

		if (!this.doesUserExist(email)) {
			
			chats[email] = {
				first_name,
				last_name,
				email,
				bio,
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
