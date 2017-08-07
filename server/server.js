const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {isRealString} = require('./utils/validation');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {Users} = require('./utils/users');

const public = path.join(__dirname + '../public'); // path to public folder
const port = process.env.PORT || 3000; // set up port for Heroku
var app = express(); // create the express app

// express uses a built in node module called HTTP to create this server
// we need to use HTTP and configure it with express, then we can add Socket.io support
var server = http.createServer(app);

// configure http server to use Socket.io by passing it the server
// We get back the web sockets server with emitters and all
var io = socketIO(server);

// users
var users = new Users();

// Bind application-level middleware to an instance of the app object using app.use()
// The only built-in middleware function in Express is express.static.
// This function is based on serve-static, and is responsible for serving
// static assets such as HTML files, images, and so on.
app.use(express.static('public'));

// the socket parameter has to be the same as the name of var socket = io() in the index.js file
io.on('connection', (socket) => {
  console.log('New user connected.');

  // listen for join event when users join a room
  socket.on('join', (params, acknowledgementCallback) => {
    // set up validation isRealString
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return acknowledgementCallback('Name and Room name are required.');
    }

    // room join and users list
    socket.join(params.room); // to join a specific Room
    users.removeUser(socket.id); // remove user from any previous joined rooms
    users.addUser(socket.id, params.name, params.room); // add users to new room

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    //socket.leave(params.room)
    // socket from admin text welcome to the chat app automatically shown when first connected - similar to chatbot messaging
    socket.emit('newMessage', generateMessage('Admin', `Welcome to the ${params.room} room.`));

    // socket.broadcast.emit sends event to all connections but the user emiting the event
    socket.broadcast.to(params.room).emit('newMessage',  generateMessage('Admin', `${params.name} has joined the room.`));


    acknowledgementCallback();
  });

  // server side so we can use ES6 functions
  // listen for client messages
  socket.on('createMessage', (message, acknowledgementCallback) => {
    console.log('createMessage', message);
    // emit a message to all users (io.emit does this, socket.emit sends to only 1 user)
    // *we know we are getting a from and text property from the client so we put them here
    io.emit('newMessage',  generateMessage(message.from, message.text));
    acknowledgementCallback();
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  // listen for disconnect
  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);
    if (user) {
      // update user list
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      // message to room user has left
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
  });
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
