var express = require('express');

var app = express();
var directory = '/' + (process.env.STATIC_DIR || 'build')
console.log(__dirname + directory)
app.use(express.static(__dirname + directory));

var port = process.env.PORT || 3004;
app.listen(port, function () {
  console.log('Listening on', port);
});