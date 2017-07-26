var socket = io(); // initiate a websocket and keep it open

// ES6 is only supported by Chrome at this time, so we cannot
// use the arrow function on client side: socket.on('connect', () => {})
socket.on('connect', function () {
  console.log('Connected to server.');

  // dont emit the events until we are connected
});

socket.on('disconnect', function () {
  console.log('Disconnected from server.');
});

// listen for chat message and display to screen
socket.on('newMessage', function (message) {
  console.log('newMessage', message);
  // create a new list item for new messages
  let li = jQuery('<li></li>');
  // add the text
  li.text(`${message.from}: ${message.text}`);
  // append to the messages <ol> on the index.html file
  jQuery('#messages').append(li);
});

// overriding the default form submit behavior that causes
// the page to refresh. we intercept the submit event here
jQuery('#message-form').on('submit', function (event) {
  event.preventDefault(); // prevents submit event page refresh
  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function () { // acknowledgement

  })
});
