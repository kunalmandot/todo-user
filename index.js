const express = require('express');
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);    
});