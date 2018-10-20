'use strict';
const crypto = require('crypto');

class Security {
	static hashPassword(password, salt) {
		return new Promise((resolve, reject) => {
			crypto.pbkdf2(password, salt, 3e5, 32, 'sha512', (err, hashed) => {
				if (err)
					reject(err);

				resolve(hashed.toString('hex'));
			});
		});
	}

	static async verifyPassword(input, salt, passwordHash) {
		return (await this.hashPassword(input, salt)) === passwordHash;
	}

	static getRandomString(length) {
		return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
	}

	static generateUserId(telephone) {
		return new Promise((resolve, reject) => {
			crypto.pbkdf2(Date.now().toString(), telephone, 5, 8, 'md5', (err, id) => {
				if (err)
					reject(err);
				
				resolve(id.toString('hex'));
			});
		});
	}
}

module.exports = Security;
