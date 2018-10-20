const express = require('express');

const app = express();
const path = require('path');

const server = require('http').Server(app);
const io = require('socket.io')(server);

const cors = require('cors');
app.use(express.json());

app.options('*', cors());
app.use(cors({
	origin: function (origin, callback) {
		callback(null, true)
	}
}));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/api', require('./lib/routes/api.js'));

app.get('*', (req, res) => {
	res.send(responses.error('404 Not Found'));
});


server.listen(8080);


// io socket
io.on('connection', socket => {
	socket.on("chat message", function(msg){
		socket.broadcast.emit('chat message', msg);
		socket.emit('chat message', msg);
		console.log("send: ", msg)
	})
});