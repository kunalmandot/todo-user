const express = require('express');
const todos = require('../../data/todos');
const authenticateToken = require('../../middlewares/authenticateToken');

const router = express.Router();

// get todo item list
router.get('/', authenticateToken, (req, res) => {
    const result = todos.filter(function(todo) {
        if (todo.username === req.user.username) {
            return todo;
        }
    });
    res.json(result);
});

// get todo item
router.get('/:id', authenticateToken, (req, res) => {
    const todo = todos.find(todo => todo.id === parseInt(req.params.id));
    if (!todo) {
        return res.status(404).json({'msg': `The TODO item with id ${req.params.id} was not found.`});
    }
    if (todo.username !== req.user.username) {
        return res.status(401).json({'msg': 'You are not authorized to access.'});
    }

    res.json(todo);
});

// create todo item 
router.post('/', authenticateToken,(req, res) => {
    if(!req.body.heading || !req.body.body) {
        return res.status(400).json({'msg': 'Heading and body both are required.'});
    }

    const todo = {
        id: todos.length + 1,
        username: req.user.username,
        heading: req.body.heading,
        body: req.body.body
    }
    todos.push(todo);

    res.json({'msg': 'Created sucessfully.', todo});
});

// update todo item
router.put('/:id', authenticateToken, (req, res) => {
    if(!req.body.heading && !req.body.body) {
        return res.status(400).json({'msg': 'Heading and body either both or anyone is required.'});
    }

    const todoIndex = todos.findIndex(todo => todo.id === parseInt(req.params.id));
    if (todoIndex === -1) {
        return res.status(404).json({'msg': `The TODO item with id ${req.params.id} was not found.`});
    }
    if (todo.username !== req.user.username) {
        return res.status(401).json({'msg': 'You are not authorized to access.'});
    }
    
    if(req.body.heading) {
        todos[todoIndex].heading = req.body.heading;
    }
    if(req.body.body) {
        todos[todoIndex].body = req.body.body;
    }
    const todo = todos[todoIndex];

    res.json({'msg': 'Updated sucessfully.', todo});
});

// delete todo item
router.delete('/:id', authenticateToken, (req, res) => {
    const todoIndex = todos.findIndex(todo => todo.id === parseInt(req.params.id));
    if (todoIndex === -1) {
        return res.status(404).json({'msg': `The TODO item with id ${req.params.id} was not found.`});
    }
    if (todo.username !== req.user.username) {
        return res.status(401).json({'msg': 'You are not authorized to access.'});
    }

    const todo = todos[todoIndex];

    todos.splice(todoIndex, 1);

    res.json({'msg': 'Deleted sucessfully.', todo});
});

module.exports = router