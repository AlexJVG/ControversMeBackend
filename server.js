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
app.use('/api', require('./lib/routes/api.js'));

app.all('*', (req, res) => {
	res.send(responses.error(404));
});


server.listen(8080);


// io socket

io.on('connection', socket => {
	socket.on("chat message", function(arr){
		let [id, msg] = JSON.parse(arr)
		console.log(id)
		socket.join(id)
		socket.to(id).emit('chat message', msg);
		socket.emit('chat message', msg);
		console.log("send: ", msg)
	});
	socket.on("leave", function(id){
		socket.leave(id);
	});
});