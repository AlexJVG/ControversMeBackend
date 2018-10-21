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
		return JSON.parse(JSON.stringify(this.rooms));
	}


	createRoom(id, name, creator) {
		this.rooms[id] = {
			name,
			creator,
			voters: {},
			debaters: {},
			time: Date.now()
		}

		this.chats[id] = [];

		this.save();
	}

	recordChat(id, from, text) {

		this.chats[id].push({
			from,
			text,
			time: Date.now()
		});

		this.save();

	}

	getChats(room) {
		return JSON.parse(JSON.stringify(this.chats[room]));
	}

	isRoom(room) {
		return !!this.chats[room];
	}

	createNickname(room, email, nickname) {
		this.rooms[room].aliases[email] = nickname;
	}

	getRoom(room) {
		return JSON.parse(JSON.stringify(this.rooms[room]));
	}

	upvoteDebator(room, email) {
		this.rooms[room].debaters[email]++;

		this.save();
	}

	becomeADebator(room, email) {
		this.rooms[room].debaters[email] = 0;

		this.save();
	}

	userExists(email) {
		return !!this.users[email];
	}

	getUser(email) {
		return this.userExists(email) && JSON.parse(JSON.stringify(this.users[email]));
	}

	getEmailFromUsername(username) {

		for (let user in this.users) {
			if (this.users[user].username === username) {
				return user;
			}
		}

		return false;

	}

	addVoterToRoom(room, email, choice) {

		this.rooms[room].voters[email] = choice;
		this.save();
	}

	getVoter(room, email) {
		return this.rooms[room] && this.rooms[room].voters[email];
	}

	downvoteOtherDebator(room, email) {
		for (let debater in this.rooms[room].debaters) {
			if (debater !== email) {
				this.rooms[room].debaters[debater]--;
			}
		}

		this.save();
	}
}

module.exports = Database;
