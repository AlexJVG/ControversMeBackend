const express = require('express');
const app = express();




app.get('/', (req, res) => {

	res.send('hello');

});

app.get('/egor/:hello', (req, res) => {

	res.send(req.params.hello);

});

app.listen(8080);
