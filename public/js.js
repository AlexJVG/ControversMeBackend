

function test() {
    var socket = io();
  $('form').submit(function(e){
    e.preventDefault()
    socket.connect()
    socket.emit('join', 'room');
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });
  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
    window.scrollTo(0, document.body.scrollHeight);
  });
}

test()



