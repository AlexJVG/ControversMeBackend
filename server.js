const express = require('express');

const app = express();
const path = require('path');

const server = require('http').Server(app);
const io = require('socket.io')(server);

const responses = require('./lib/responses.js');

const cors = require('cors');
app.use(express.json());

app.options('*', cors());
app.use(cors({
	origin: function (origin, callback) {
		callback(null, true)
	}
}));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/api', require('./lib/routes/api.js').router);

io.on('connection', require('./lib/routes/api.js').socketResponse(io));

app.all('*', (req, res) => {
	res.send(responses.error(404));
});

server.listen(8080);
