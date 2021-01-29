const express = require('express');
const todo = require('./routes/api/todo');

const app = express();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// api/todo route
app.use('/api/todos', todo);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);    
});