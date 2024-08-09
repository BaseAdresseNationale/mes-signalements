const express = require('express');

const app = express();
const directory = '/' + (process.env.STATIC_DIR || 'build')
console.log(__dirname + directory)
app.use(express.static(__dirname + directory));

const port = process.env.PORT || 3004;
app.listen(port, function () {
  console.log('Listening on', port);
});