const express = require('express');
const todos = require('../../data/todos.js');

const router = express.Router();

// get todo item list
router.get('/', (req, res) => {
    res.json(todos);
});

// get todo item
router.get('/:id', (req, res) => {
    const todo = todos.find(todo => todo.id === parseInt(req.params.id));
    if (!todo) {
        return res.status(404).json({'msg': `The TODO item with id ${req.params.id} was not found.`});
    }

    res.json(todo);
});

// create todo item 
router.post('/', (req, res) => {
    if(!req.body.heading || !req.body.body) {
        return res.status(400).json({'msg': 'Heading and body both are required.'});
    }

    const todo = {
        id: todos.length + 1,
        heading: req.body.heading,
        body: req.body.body
    }
    todos.push(todo);

    res.json({'msg': 'Created sucessfully.', todo});
});

// update todo item
router.put('/:id', (req, res) => {
    if(!req.body.heading && !req.body.body) {
        return res.status(400).json({'msg': 'Heading and body either both or anyone is required.'});
    }

    const todoIndex = todos.findIndex(todo => todo.id === parseInt(req.params.id));
    if (todoIndex === -1) {
        return res.status(404).json({'msg': `The TODO item with id ${req.params.id} was not found.`});
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
router.delete('/:id', (req, res) => {
    const todoIndex = todos.findIndex(todo => todo.id === parseInt(req.params.id));
    if (todoIndex === -1) {
        return res.status(404).json({'msg': `The TODO item with id ${req.params.id} was not found.`});
    }

    const todo = todos[todoIndex];

    todos.splice(todoIndex, 1);

    res.json({'msg': 'Deleted sucessfully.', todo});
});

module.exports = router