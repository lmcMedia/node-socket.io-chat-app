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
  var formattedTime = moment(message.createAt).format('h:mm a');
  var template = jQuery('#message-template').html();

  // send the message.text to the Mustache {{text}} on the index.html page
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
});

// listen for the Send Location button GeoLocation message
socket.on('newLocationMessage', function(message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#location-message-template').html();

  // send the url to Mustache {{url}}
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
})


// overriding the default form submit behavior that causes
// the page to refresh. we intercept the submit event here
jQuery('#message-form').on('submit', function (event) {
  event.preventDefault(); // prevents submit event page refresh

  var messageTextbox = jQuery('[name=message]');

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
