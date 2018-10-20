
module.exports = socket => {
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
}