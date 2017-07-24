var socket = io(); // initiate a websocket and keep it open

// ES6 is only supported by Chrome at this time, so we cannot
// use the arrow function: socket.on('connect', () => {})
socket.on('connect', function () {
  console.log('Connected to server.');

  // dont emit the events until we are connected
});

socket.on('disconnect', function () {
  console.log('Disconnected from server.');
});

// listen for chat message
socket.on('newMessage', function (message) {
  console.log('newMessage', message);
});
