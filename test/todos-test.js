const { assert } = require('chai');
const MockExpressResponse = require('mock-express-response');
require('../index');

// eslint-disable-next-line object-curly-newline
const { getTodos, postTodo, getTodo, putTodo, deleteTodo } = require('../api/controllers/todos');

describe('Todos', () => {
    describe('getTodos', () => {
        it('it should show all the todos that are related to specific user', async () => {
            const req = {
                user: {
                    userId: '601bedf58cfd442160f8ca07',
                },
            };
            const response = await getTodos(req, new MockExpressResponse());
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 200);
            assert.isArray(result);
            assert.isAtLeast(result.length, 1);
        });

        it('it should show no todos found msg', async () => {
            const req = {
                user: {
                    userId: '6024bdfab48c182c20a6264b',
                },
            };
            const response = await getTodos(req, new MockExpressResponse());
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 200);
            assert.strictEqual(result.msg, 'No todos found.');
            assert.isNotArray(result);
        });
    });

    describe('postTodo', () => {
        /* it('it should create a todo', async () => {
            const req = {
                user: {
                    userId: '601bedf58cfd442160f8ca07',
                },
                body: {
                    title: 'test title',
                    body: 'test body',
                },
            };
            const response = await postTodo(req, new MockExpressResponse());
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 200);
            assert.strictEqual(result.msg, 'Created Successfully');
        }); */

        it('it should show required msg', async () => {
            const req = {
                user: {
                    userId: '601bedf58cfd442160f8ca07',
                },
                body: {
                    title: 'test title',
                },
            };
            const response = await postTodo(req, new MockExpressResponse());
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 400);
            assert.strictEqual(result.msg, 'Title and body both are required.');
        });

        it('it should show todo title already taken msg', async () => {
            const req = {
                user: {
                    userId: '601bedf58cfd442160f8ca07',
                },
                body: {
                    title: 'test title',
                    body: 'test body',
                },
            };
            const response = await postTodo(req, new MockExpressResponse());
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 400);
            assert.strictEqual(result.msg, 'Todo title already taken.');
        });
    });

    describe('getTodo', () => {
        it('it should show a todo', async () => {
            const req = {
                user: {
                    userId: '601bedf58cfd442160f8ca07',
                },
                params: {
                    id: '6024fd3f649e8e37d00a0441',
                },
            };
            const response = await getTodo(req, new MockExpressResponse());
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 200);
            assert.strictEqual(result._id, req.params.id);
        });

        it('it should show an unauthorized error', async () => {
            const req = {
                user: {
                    userId: '601beec552ce9919f474d4ba',
                },
                params: {
                    id: '6024fd3f649e8e37d00a0441',
                },
            };
            const response = await getTodo(req, new MockExpressResponse());
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 401);
            assert.strictEqual(result.msg, 'You are not authorized to access.');
        });

        it('it should show a resource not found error as id does not exist', async () => {
            const req = {
                user: {
                    userId: '601bedf58cfd442160f8ca07',
                },
                params: {
                    id: '6024fd3f649e8e37d00a0442',
                },
            };
            const response = await getTodo(req, new MockExpressResponse());
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 404);
            assert.strictEqual(result.msg, `The TODO item with id ${req.params.id} was not found.`);
        });

        it('it should show a resource not found error as length of id is less than 24', async () => {
            const req = {
                user: {
                    userId: '601bedf58cfd442160f8ca07',
                },
                params: {
                    id: '6024fd3f6',
                },
            };
            const response = await getTodo(req, new MockExpressResponse());
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 404);
            assert.strictEqual(result.msg, `The TODO item with id ${req.params.id} was not found.`);
        });

        it('it should show a resource not found error as length of id is more than 24', async () => {
            const req = {
                user: {
                    userId: '601bedf58cfd442160f8ca07',
                },
                params: {
                    id: '6024fd3f6601bedf58cfd442160f8ca07',
                },
            };
            const response = await getTodo(req, new MockExpressResponse());
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 404);
            assert.strictEqual(result.msg, `The TODO item with id ${req.params.id} was not found.`);
        });
    });

    describe('putTodo', () => {
        it('it should update title and body both of a todo', async () => {
            const req = {
                user: {
                    userId: '601bedf58cfd442160f8ca07',
                },
                params: {
                    id: '6024fd3f649e8e37d00a0441',
                },
                body: {
                    title: 'test title 2',
                    body: 'test title 2',
                },
            };
            const response = await putTodo(req, new MockExpressResponse());
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 200);
            assert.strictEqual(result.msg, 'Updated successfully.');
        });

        it('it should update a title of a todo', async () => {
            const req = {
                user: {
                    userId: '601bedf58cfd442160f8ca07',
                },
                params: {
                    id: '6024fd3f649e8e37d00a0441',
                },
                body: {
                    title: 'test title 3',
                },
            };
            const response = await putTodo(req, new MockExpressResponse());
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 200);
            assert.strictEqual(result.msg, 'Updated successfully.');
        });

        it('it should show title already taken msg', async () => {
            const req = {
                user: {
                    userId: '601bedf58cfd442160f8ca07',
                },
                params: {
                    id: '6024fd3f649e8e37d00a0441',
                },
                body: {
                    title: 'test title',
                },
            };
            const response = await putTodo(req, new MockExpressResponse());
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 400);
            assert.strictEqual(result.msg, 'Todo title already taken.');
        });

        it('it should update a body of a todo', async () => {
            const req = {
                user: {
                    userId: '601bedf58cfd442160f8ca07',
                },
                params: {
                    id: '6024fd3f649e8e37d00a0441',
                },
                body: {
                    body: 'test body',
                },
            };
            const response = await putTodo(req, new MockExpressResponse());
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 200);
            assert.strictEqual(result.msg, 'Updated successfully.');
        });

        it('it should show an unauthorized error', async () => {
            const req = {
                user: {
                    userId: '601beec552ce9919f474d4ba',
                },
                params: {
                    id: '6024fd3f649e8e37d00a0441',
                },
                body: {
                    body: 'test body',
                },
            };
            const response = await putTodo(req, new MockExpressResponse());
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 401);
            assert.strictEqual(result.msg, 'You are not authorized to access.');
        });

        it('it should show a resource not found error if resource does not exist', async () => {
            const req = {
                user: {
                    userId: '601bedf58cfd442160f8ca07',
                },
                params: {
                    id: '6024fd3f649e8e37d00a0442',
                },
                body: {
                    body: 'test body',
                },
            };
            const response = await putTodo(req, new MockExpressResponse());
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 404);
            assert.strictEqual(result.msg, `The TODO item with id ${req.params.id} was not found.`);
        });

        it('it should show a resource not found error as length of id is less than 24', async () => {
            const req = {
                user: {
                    userId: '601bedf58cfd442160f8ca07',
                },
                params: {
                    id: '6024fd3f6',
                },
                body: {
                    body: 'test body',
                },
            };
            const response = await putTodo(req, new MockExpressResponse());
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 404);
            assert.strictEqual(result.msg, `The TODO item with id ${req.params.id} was not found.`);
        });

        it('it should show a resource not found error as length of id is more than 24', async () => {
            const req = {
                user: {
                    userId: '601bedf58cfd442160f8ca07',
                },
                params: {
                    id: '6024fd3f6601bedf58cfd442160f8ca07',
                },
                body: {
                    body: 'test body',
                },
            };
            const response = await getTodo(req, new MockExpressResponse());
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 404);
            assert.strictEqual(result.msg, `The TODO item with id ${req.params.id} was not found.`);
        });

        it('it should show required msg', async () => {
            const req = {
                user: {
                    userId: '601bedf58cfd442160f8ca07',
                },
                params: {
                    id: '6024fd3f649e8e37d00a0441',
                },
                body: {
                },
            };
            const response = await putTodo(req, new MockExpressResponse());
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 400);
            assert.strictEqual(result.msg, 'title and body either both or anyone is required.');
        });
    });

    describe('deleteTodo', () => {
        /* it('it should delete a todo', async () => {
            const req = {
                user: {
                    userId: '601bedf58cfd442160f8ca07',
                },
                params: {
                    id: '6025055aaf2b9732a439e12c',
                },
            };
            const response = await deleteTodo(req, new MockExpressResponse());
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 200);
            assert.strictEqual(result.msg, 'Deleted successfully.');
        }); */

        it('it should show an unauthorized error', async () => {
            const req = {
                user: {
                    userId: '601beec552ce9919f474d4ba',
                },
                params: {
                    id: '6024fd3f649e8e37d00a0441',
                },
            };
            const response = await deleteTodo(req, new MockExpressResponse());
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 401);
            assert.strictEqual(result.msg, 'You are not authorized to access.');
        });

        it('it should show a resource not found error as id does not exist', async () => {
            const req = {
                user: {
                    userId: '601bedf58cfd442160f8ca07',
                },
                params: {
                    id: '6024fd3f649e8e37d00a0442',
                },
            };
            const response = await deleteTodo(req, new MockExpressResponse());
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 404);
            assert.strictEqual(result.msg, `The TODO item with id ${req.params.id} was not found.`);
        });

        it('it should show a resource not found error as length of id is less than 24', async () => {
            const req = {
                user: {
                    userId: '601bedf58cfd442160f8ca07',
                },
                params: {
                    id: '6024fd3f6',
                },
            };
            const response = await deleteTodo(req, new MockExpressResponse());
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 404);
            assert.strictEqual(result.msg, `The TODO item with id ${req.params.id} was not found.`);
        });

        it('it should show a resource not found error as length of id is more than 24', async () => {
            const req = {
                user: {
                    userId: '601bedf58cfd442160f8ca07',
                },
                params: {
                    id: '6024fd3f6601bedf58cfd442160f8ca07',
                },
            };
            const response = await deleteTodo(req, new MockExpressResponse());
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 404);
            assert.strictEqual(result.msg, `The TODO item with id ${req.params.id} was not found.`);
        });
    });
});
