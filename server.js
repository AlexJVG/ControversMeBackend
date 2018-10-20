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

app.all('*', (req, res) => {
	res.send(responses.error(404));
});


server.listen(8080);


// io socket

io.on('connection', socket => {

	io.sockets.in("room").emit('connectToRoom', "room");
	socket.on('join', room => {
    	socket.join("room");
    });
	socket.on("chat message", function(msg){
		socket.broadcast.emit('chat message', msg);
		socket.emit('chat message', msg);
		console.log("send: ", msg)
	})

// 	socket.on('disconnect', function(){
//     io.emit('users-changed', {user: socket.nickname, event: 'left'});   
//   });
 
//   socket.on('set-nickname', (nickname) => {
//     socket.nickname = nickname;
//     io.emit('users-changed', {user: nickname, event: 'joined'});    
//   });
  
//   socket.on('add-message', (message) => {
//     io.emit('message', {text: message.text, from: socket.nickname, created: new Date()});    
//   });
});