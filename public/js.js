

function test() {
    var socket = io();
    socket.emit('join', 'room');
  $('form').submit(function(e){
    e.preventDefault()
    socket.connect()
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



