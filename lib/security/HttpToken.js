'use strict';
const crypto = require('crypto');

class HttpToken {
	constructor(encryptionSecret, initVector, clientSecret = '') {
		if (encryptionSecret.length !== 32)
			throw new TypeError('Secret key is not of length 32');

		if (initVector.length !== 16)
			throw new TypeError('Initialization vector is not of length 16');

		this.encryptionSecret = encryptionSecret;
		this.initVector = initVector;
		this.clientSecret = clientSecret;
		this.serverName = 'yeet-co';
	}

	// all the crypto stuff
	_encrypt(stringToEncrypt) {
		let cipher = crypto.createCipheriv('aes-256-cbc', this.encryptionSecret, this.initVector);

		return cipher.update(stringToEncrypt, 'utf8', 'hex') + cipher.final('hex');
	}

	_decrypt(stringToDecrypt) {
		let decipher = crypto.createDecipheriv('aes-256-cbc', this.encryptionSecret, this.initVector);

		return decipher.update(stringToDecrypt, 'hex', 'utf8') + decipher.final('utf8');
	}

	// actual token data stuff
	generateToken(payload) {
		let token = [
			{
				cre: Date.now(),
				ser: this.serverName,
				sec: this.clientSecret
			},
			payload
		];

		return this._encrypt(JSON.stringify(token));
	}

	verifyAndDecrypt(encryptedToken) {
		try {
			let decrypted = JSON.parse(this._decrypt(encryptedToken));

			if (
				decrypted[0].cre
				&& decrypted[0].ser === this.serverName
				&& decrypted[0].sec === this.clientSecret
				&& decrypted[1]
			)
				return decrypted[1]; // return just the payload, not the headers
		} catch (e) {}

		return false;
	}
}

module.exports = HttpToken;

/* 
example token

pseudo-code: [headers, payload]
payload is completely user defined

[
		{
				"cre": 1533543624280,
				"ser": "yeet-co",
				"sec": "asdfaEFSJ83"
		},
		{
				"tel": 16505829403,
				"name": "Arjun Patrawala",
				// other stuff
		}
]
*/