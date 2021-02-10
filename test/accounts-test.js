const { assert } = require('chai');
const MockExpressResponse = require('mock-express-response');
require('../index');

const { login } = require('../api/controllers/accounts');

describe('Accounts', () => {
    describe('/login', () => {
        it('it should log in user', async () => {
            const req = {
                body: {
                    userName: 'kunal',
                    password: 'kunal123',
                },
            };
            const response = await login(req, new MockExpressResponse());
            // console.log(response);
            // eslint-disable-next-line no-underscore-dangle
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 200);
            assert.strictEqual(result.msg, 'Logged in successfully.');
        });

        it('it should show invalid credentials to the user', async () => {
            const req = {
                body: {
                    userName: 'kunal',
                    password: 'kunal1234',
                },
            };
            const response = await login(req, new MockExpressResponse());
            // eslint-disable-next-line no-underscore-dangle
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 401);
            assert.strictEqual(result.msg, 'Credentials were not matched.');
        });

        it('it should show username and password required to the user', async () => {
            const req = {
                body: {
                    userName: 'kunal',
                },
            };
            const response = await login(req, new MockExpressResponse());
            // eslint-disable-next-line no-underscore-dangle
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 400);
            assert.strictEqual(result.msg, 'Username and password both are required.');
        });
    });
});
