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

io.on('connection', (socket) => {
	socket.on('leave-room', function(){
	socket.leave(socket.room);
    socket.to(socket.room).emit('users-changed', {user: socket.nickname, event: 'left'});   
  });
  socket.on('add-message', (message) => {
  	socket.to(socket.room).emit('message', {text: message.text, from: socket.nickname});
  	socket.emit('message', {text: message.text, from: socket.nickname});
  });
  socket.on('join-room',(val) => {
  	socket.join(val.room);
  	socket.nickname = val.nickname;
  	socket.room = val.room;
    socket.to(socket.room).emit('users-changed', {user: val.nickname, event: 'joined'});
  })
});

app.all('*', (req, res) => {
	res.send(responses.error(404));
});

server.listen(8080);
