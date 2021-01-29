const express = require('express');
const todos = require('../../data/todos.js');

const router = express.Router();

// get todo item list
router.get('/', (req, res) => {
    
});

// get todo item
router.get('/:id', (req, res) => {

});

// create todo item 
router.post('/', (req, res) => {

});

// update todo item
router.put('/:id', (req, res) => {

});

// delete todo item
router.delete('/:id', (req, res) => {

});

module.exports = router