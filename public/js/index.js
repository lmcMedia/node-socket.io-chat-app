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
  let formattedTime = moment(message.createAt).format('h:mm a');

  // create a new list item for new messages
  let li = jQuery('<li></li>');
  // add the text
  li.text(`${message.from} ${formattedTime}: ${message.text}`);
  // append to the messages <ol> on the index.html file
  jQuery('#messages').append(li);
});

// listen for the Send Location button GeoLocation message
socket.on('newLocationMessage', function(message) {
  let formattedTime = moment(message.createdAt).format('h:mm a');

  let li = jQuery('<li></li>');
  // open new tab to view Google Maps
  let a = jQuery('<a target="_blank">My Current Location</a>');

  // by separating the tags above into let variables, it prevents
  // someone from maliciously injecting code into the app
  // The methods below are considered safer because we are building
  // the tags from the dynamic data instead of injecting full tags
  li.text(`${message.from} ${formattedTime}: `);
  a.attr('href', message.url);
  li.append(a);

  jQuery('#messages').append(li);
})


// overriding the default form submit behavior that causes
// the page to refresh. we intercept the submit event here
jQuery('#message-form').on('submit', function (event) {
  event.preventDefault(); // prevents submit event page refresh

  let messageTextbox = jQuery('[name=message]');

  socket.emit('createMessage', {
    from: 'User',
    text: messageTextbox.val()
  }, function () { // acknowledgement
    // clears out the text field after sent
    messageTextbox.val('');
  })
});

// saves expensive task of fetching DOM. Only once done here
var locationButton = jQuery('#send-location');

// uses GeoLocation api
locationButton.on('click', function (event) {
  event.preventDefault(); // prevents submit event page refresh
  // non-supported browsers
  if(!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }
  // only disable while the process is occuring
  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function(position) {
    // re-enable the button after the position is fetched
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function() {
    // displayed if someone prompted to share location but they click Deny
    alert('Unable to fetch location.');

    // re-enable the button if user denys or other reason
    locationButton.removeAttr('disabled').text('Send location');
  })
});
