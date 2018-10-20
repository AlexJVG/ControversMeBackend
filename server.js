const express = require('express');
const app = express();
const Database = require('./lib/Database.js');
const path = require('path')
//const http = require('http').Server(app)
const io = require('socket.io');
const public = path.join(__dirname, 'public')

app.use("/", express.static(public));


app.get('/', (req, res) => {

	res.send('hello');

});

app.get('/egor/:hello', (req, res) => {

	res.send(req.params.hello);

});

app.get('/eggtest2', (req, res) => {
	res.sendFile(path.join(public, 'basic.html'));
	

});

app.listen(8080);
