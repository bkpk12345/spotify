require('dotenv').config();
const express = require('express');
const app = express();
const login = require('./routes/login');

app.use('/login', login);
app.listen(6000);
