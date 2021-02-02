const express = require('express');
const todos = require('../../data/todos');
const authenticateToken = require('../../middlewares/authenticate-token');

const router = express.Router();

const validateTodo = id => todos.find(todo => todo.id === parseInt(id));

const throwResourceNotFoundError = (res, id) => res.status(404).json({'msg': `The TODO item with id ${id} was not found.`});

const throwUnauthorizedError = res => res.status(401).json({'msg': 'You are not authorized to access.'});

// get todo item list
router.get('/', authenticateToken, (req, res) => {
    const result = todos.filter(function(todo) {
        if (todo.userName === req.user.userName) {
            return todo;
        }
    });
    res.json(result);
});

// create todo item 
router.post('/', authenticateToken,(req, res) => {
    if(!req.body.heading || !req.body.body) {
        return res.status(400).json({'msg': 'Heading and body both are required.'});
    }

    const todo = {
        id: todos.length + 1,
        userName: req.user.userName,
        heading: req.body.heading,
        body: req.body.body
    }
    todos.push(todo);

    res.json({'msg': 'Created successfully.', todo});
});


// get todo item
router.get('/:id', authenticateToken, (req, res) => {
    const todo = validateTodo(req.params.id);
    if (!todo) {
        return throwResourceNotFoundError(res, req.params.id);
    }
    if (todo.userName !== req.user.userName) {
        return throwUnauthorizedError(res);
    }
    res.json(todo);
});

// update todo item
router.put('/:id', authenticateToken, (req, res) => {
    if(!req.body.heading && !req.body.body) {
        return res.status(400).json({'msg': 'Heading and body either both or anyone is required.'});
    }

    let todo = validateTodo(req.params.id);
    if (!todo) {
        return throwResourceNotFoundError(res, req.params.id);
    }
    if (todo.userName !== req.user.userName) {
        return throwUnauthorizedError(res);
    }

    const todoIndex = todos.indexOf(todo);
    
    if(req.body.heading) {
        todos[todoIndex].heading = req.body.heading;
    }
    if(req.body.body) {
        todos[todoIndex].body = req.body.body;
    }

    todo = todos[todoIndex];

    res.json({'msg': 'Updated successfully.', todo});
});

// delete todo item
router.delete('/:id', authenticateToken, (req, res) => {
    let todo = validateTodo(req.params.id);
    if (!todo) {
        return throwResourceNotFoundError(res, req.params.id);
    }
    if (todo.userName !== req.user.userName) {
        return throwUnauthorizedError(res);
    }

    const todoIndex = todos.indexOf(todo);

    todos.splice(todoIndex, 1);

    res.json({'msg': 'Deleted successfully.', todo});
});

module.exports = router