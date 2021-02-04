const express = require('express');

const mongoose = require('mongoose');

const { port,host } = require('./config');
const todo = require('./routes/api/todo');
const account = require('./routes/api/account');

const app = express();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// api/todo route
app.use('/api/todos', todo);

// api/account route
app.use('/api/accounts', account);

app.listen(port, host, () => {
    console.log(`Server started on ${host} : ${port}`);    
});