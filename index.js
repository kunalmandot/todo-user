const express = require('express');

const mongoose = require('mongoose');

const { port,host } = require('./config');
const todos = require('./api/routes/todos');
const accounts = require('./api/routes/accounts');

const app = express();

// Connect to database
mongoose.connect("mongodb://localhost:27017/todosvc", { useNewUrlParser: true, useUnifiedTopology: true});

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// api/todo route
app.use('/api/todos', todos);

// api/account route
app.use('/api/accounts', accounts);

app.listen(port, host, () => {
    console.log(`Server started on ${host} : ${port}`);    
});