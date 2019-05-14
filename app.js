require('dotenv').config();
const express = require('express');
const app = express();
const login = require('./routes/login');
const port = process.env.PORT || 9000;
app.use('/api', login);
app.listen(port, console.log(`listening at ${port}`));
