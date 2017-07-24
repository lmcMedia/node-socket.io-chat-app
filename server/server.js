const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

// path to public folder
const public = path.join(__dirname + '/../public');

// set up port for Heroku
const port = process.env.PORT || 3000;

var app = express();
// uses http server instead of express server
var server = http.createServer(app);

// configure server to use Socket.io by passing it the server
// We get back the web sockets server with emitters and all
var io = socketIO(server);

// Bind application-level middleware to an instance of the app object by using the app.use()
// The only built-in middleware function in Express is express.static.
// This function is based on serve-static, and is responsible for serving
// static assets such as HTML files, images, and so on.
app.use(express.static('public'));

// the socket parameter has to be the same as the name of var socket = io();
io.on('connection', (socket) => {
  console.log('New user connected.');

  // server side so we can use ES6 functions
  // listen for client messages
  socket.on('createMessage', (message) => {
    console.log('client message recieved', message);
    // emit a message to all users (io.emit does this, socket.emit sends to only 1 user)
    // *we know we are getting a from and text property from the client so we put them here
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });
  });

  // listen for disconnect
  socket.on('disconnect', () => {
    console.log('User was disconnected.');
  });
});

// express uses a built in node module called HTTP to create this server
// we need to use HTTP and configure it with express to work with HTTP,
// then we can add Socket.io support (see var server above, its done)
server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
