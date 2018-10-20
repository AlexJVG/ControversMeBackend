const express = require('express');
const app = express();
const Database = require('./lib/Database.js');



app.get('/', (req, res) => {

	res.send('hello');

});

app.get('/egor/:hello', (req, res) => {

	res.send(req.params.hello);

});

app.listen(8080);
