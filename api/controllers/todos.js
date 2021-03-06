const Todo = require('../models/todo');

const validateTodo = async (id) => Todo.findById(id);

const throwResourceNotFoundError = (res, id) => res.status(404).json({ msg: `The TODO item with id ${id} was not found.` });

const throwUnauthorizedError = (res) => res.status(401).json({ msg: 'You are not authorized to access.' });

const throwServerError = (res) => res.status(500).json({ msg: 'Something went wrong.' });

const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({ createdBy: req.user.userId });
        if (todos.length === 0) {
            return res.json({ msg: 'No todos found.' });
        }
        return res.json(todos);
    } catch (err) {
        return throwServerError(res);
    }
};

const postTodo = async (req, res) => {
    const { title, body } = req.body;
    if (!title || !body) {
        return res.status(400).json({ msg: 'Title and body both are required.' });
    }
    try {
        const todo = new Todo({
            createdBy: req.user.userId,
            title,
            body,
        });
        const savedTodo = await todo.save();
        if (savedTodo) {
            return res.json({ msg: 'Created Successfully', todo: savedTodo });
        }
        return throwServerError(res);
    } catch (err) {
        if (err.name === 'MongoError' && err.code === 11000) {
            return res.status(400).json({ msg: 'Todo title already taken.' });
        }
        return throwServerError(res);
    }
};

const getTodo = async (req, res) => {
    const { id } = req.params;
    if (id.length !== 24) {
        return throwResourceNotFoundError(res, id);
    }
    try {
        const todo = await validateTodo(id);
        if (todo === null) {
            return throwResourceNotFoundError(res, id);
        }
        if (String(todo.createdBy) !== req.user.userId) {
            return throwUnauthorizedError(res);
        }
        return res.json(todo);
    } catch (err) {
        return throwServerError(res);
    }
};

const putTodo = async (req, res) => {
    const { title, body } = req.body;
    const { id } = req.params;
    if (!title && !body) {
        return res.status(400).json({ msg: 'title and body either both or anyone is required.' });
    }
    if (id.length !== 24) {
        return throwResourceNotFoundError(res, id);
    }
    try {
        const todo = await validateTodo(id);
        if (todo === null) {
            return throwResourceNotFoundError(res, id);
        }
        if (String(todo.createdBy) !== req.user.userId) {
            return throwUnauthorizedError(res);
        }
        let updatedTodo;
        if (title) {
            const titleExist = await Todo.findOne({ title });
            if (titleExist) {
                return res.status(400).json({ msg: 'Todo title already taken.' });
            }
            if (body) {
                updatedTodo = await Todo.findByIdAndUpdate(id, { $set: { title, body } }, { new: true });
            } else {
                updatedTodo = await Todo.findByIdAndUpdate(id, { $set: { title } }, { new: true });
            }
        } else {
            updatedTodo = await Todo.findByIdAndUpdate(id, { $set: { body } }, { new: true });
        }
        return res.json({ msg: 'Updated successfully.', todo: updatedTodo });
    } catch (err) {
        return throwServerError(res);
    }
};

const deleteTodo = async (req, res) => {
    const { id } = req.params;
    if (id.length !== 24) {
        return throwResourceNotFoundError(res, id);
    }
    try {
        const todo = await validateTodo(id);
        if (todo === null) {
            return throwResourceNotFoundError(res, id);
        }
        if (String(todo.createdBy) !== req.user.userId) {
            return throwUnauthorizedError(res);
        }
        await Todo.deleteOne({ _id: id });
        return res.json({ msg: 'Deleted successfully.', todo });
    } catch (err) {
        return throwServerError(res);
    }
};

module.exports = {
    getTodos,
    postTodo,
    getTodo,
    putTodo,
    deleteTodo,
};
