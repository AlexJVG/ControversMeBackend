const fs = require('fs');

class Database {

	constructor() {

		let file = JSON.parse( fs.readFileSync('./databse.json') );

		this.chats = file.chats;
		this.users = file.users;

	}

	save() {
		fs.writeFileSync(JSON.stringify({
			chats: this.chats,
			users: this.users
		}));
	}



}

module.exports = Database;
