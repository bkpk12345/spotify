require('dotenv').config();
const express = require('express');
const app = express();
const login = require('./routes/login');
const https = require('https');
const options = {
  hostname: 'localhost'
};
app.use('/api', login);

const port = process.env.PORT || 9000;
const server = https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
});

server.listen(8888);
