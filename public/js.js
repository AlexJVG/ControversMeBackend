var room = 'room'
var num = 1;
function test() {
    socket = io();
  $('form').submit(function(){
    socket.connect()
    socket.emit('chat message', JSON.stringify([room, $('#m').val()]));
    $('#m').val('');
    return false;
  });
  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
    window.scrollTo(0, document.body.scrollHeight);
  });
}

function changerooom() {
  socket.emit('leave',room);
  room = 'room' + num++;
  console.log(room);
}

test()



