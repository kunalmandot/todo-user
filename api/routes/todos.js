const express = require('express');

const Todo = require('../models/todo');
const authenticateToken = require('../../middlewares/authenticate-token');
const todo = require('../models/todo');

const router = express.Router();

const validateTodo = async (id) => Todo.findById(id);

const throwResourceNotFoundError = (res, id) => res.status(404).json({msg: `The TODO item with id ${id} was not found.`});

const throwUnauthorizedError = res => res.status(401).json({msg: 'You are not authorized to access.'});

// get todo item list
router.get('/', authenticateToken, async (req, res) => {
    try {
        const todos = await Todo.find({createdBy: req.user.userId});
        if(todos.length === 0) {
            res.json({msg: 'No todos found.'});
        }
        res.json(todos);
    } catch(err) {
        res.status(500).json({msg: 'Something went wrong.'});
    }
});

// create todo item 
router.post('/', authenticateToken, async (req, res) => {
    const {title, body} = req.body;
    if(!title || !body) {
        return res.status(400).json({msg: 'Title and body both are required.'});
    }
    try {
        const todo = new Todo({
            createdBy: req.user.userId,
            title,
            body
        });
        const savedTodo = await todo.save();
        if(savedTodo) {
            return res.json({msg: 'Created Successfully', todo: savedTodo});
        }    
    } catch(err) {
        if (err.name === "MongoError" && err.code === 11000) {
            return res.status(400).json({msg: 'Todo title already taken.'});
        }
        return res.status(500).json({msg: 'Something went wrong.'});    
    }    
});


// get todo item
router.get('/:id', authenticateToken, async (req, res) => {
    const {id} = req.params;
    if(id.length !== 24) {
        return throwResourceNotFoundError(res, id);
    }
    try {
        const todo = await validateTodo(id);
        if(todo === null) {
            return throwResourceNotFoundError(res, id);        
        }
        if (String(todo.createdBy) !== req.user.userId) {
            return throwUnauthorizedError(res);
        }        
        res.json(todo);
    } catch(err) {
        return res.status(500).json({msg: 'Something went wrong.'});
    }
});

// update todo item
router.put('/:id', authenticateToken, async (req, res) => {
    const {title, body} = req.body;
    const {id} = req.params;
    if(!title && !body) {
        return res.status(400).json({msg: 'title and body either both or anyone is required.'});
    }
    if(id.length !== 24) {
        return throwResourceNotFoundError(res, id);
    }
    try {
        const todo = await validateTodo(id);
        if(todo === null) {
            return throwResourceNotFoundError(res, id);        
        }
        if (String(todo.createdBy) !== req.user.userId) {
            return throwUnauthorizedError(res);
        }   
        let updatedTodo;     
        if (title && body) {
            updatedTodo = await Todo.findByIdAndUpdate(id, {$set:{title, body}}, {new: true});
        } else if(title) {
            updatedTodo = await Todo.findByIdAndUpdate(id, {$set:{title}}, {new: true});
        } else {
            updatedTodo = await Todo.findByIdAndUpdate(id, {$set:{body}}, {new: true});
        }
        res.json({msg: 'Updated successfully.', todo: updatedTodo});
    } catch(err) {
        return res.status(500).json({msg: 'Something went wrong.'});
    }
});

// delete todo item
router.delete('/:id', authenticateToken, async (req, res) => {
    const {id} = req.params;
    if(id.length !== 24) {
        return throwResourceNotFoundError(res, id);
    }
    try {
        const todo = await validateTodo(id);
        if(todo === null) {
            return throwResourceNotFoundError(res, id);        
        }
        if (String(todo.createdBy) !== req.user.userId) {
            return throwUnauthorizedError(res);
        }        
        await Todo.deleteOne({_id: id});
        res.json({msg: 'Deleted successfully.', todo});
    } catch(err) {
        return res.status(500).json({msg: 'Something went wrong.'});
    }
});

module.exports = router