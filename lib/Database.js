const fs = require('fs');
const path = require('path');


class Database {

	constructor() {

		let file = JSON.parse( fs.readFileSync( path.join(__dirname, 'database.json') ));
		this.users = file.users || {};
		this.chats = file.chats || {};
		this.rooms = file.rooms || {};

	}

	save() {
		fs.writeFileSync(path.join(__dirname, 'database.json'), JSON.stringify({
			users: this.users,
			chats: this.chats,
			rooms: this.rooms
		}));
	}

	addNewUser(first_name, last_name, username, email, bio, password, salt) {


		if (!this.doesUserExist(email)) {
			
			this.users[email] = {
				first_name,
				last_name,
				username,
				email,
				bio,
				password,
				salt,
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

	getUser(email) {
		return this.users[email];
	}

	getAllRooms() {
		return this.rooms;
	}


	createRoom(id, name, creator) {
		this.rooms[id] = {
			name,
			creator
		}

		this.chats[id] = [];

		this.save();
	}

	recordChat(id, from, text) {

		this.chats[id].push({
			from,
			text
		});

		this.save();

	}

	getChats(room) {
		return this.chats[room];
	}

	isRoom(room) {
		return !!this.chats[room];
	}

}

module.exports = Database;
