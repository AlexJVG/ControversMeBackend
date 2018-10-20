function test() {
    var socket = io();
  $('form').submit(function(){
    socket.connect()
    socket.emit('chat message', JSON.stringify(['room', $('#m').val()]));
    $('#m').val('');
    return false;
  });
  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
    window.scrollTo(0, document.body.scrollHeight);
  });
}

test()



