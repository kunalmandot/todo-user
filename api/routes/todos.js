const express = require('express');

// eslint-disable-next-line object-curly-newline
const { getTodos, postTodo, getTodo, putTodo, deleteTodo } = require('../controllers/todos');
const authenticateToken = require('../../middlewares/authenticate-token');

const router = express.Router();

// get todo item list
router.get('/', authenticateToken, getTodos);

// create todo item
router.post('/', authenticateToken, postTodo);

// get todo item
router.get('/:id', authenticateToken, getTodo);

// update todo item
router.put('/:id', authenticateToken, putTodo);

// delete todo item
router.delete('/:id', authenticateToken, deleteTodo);

module.exports = router;
