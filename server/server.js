const express = require('express');
const path = require('path');
// set up port for Heroku
const port = process.env.PORT || 3000;

var app = express();

// Bind application-level middleware to an instance of the app object by using the app.use()
// The only built-in middleware function in Express is express.static.
// This function is based on serve-static, and is responsible for serving
// static assets such as HTML files, images, and so on.
const public = path.join(__dirname + '/../public');
app.use(express.static('public'));


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})
