const { assert } = require('chai');
const MockExpressResponse = require('mock-express-response');
require('../index');

// eslint-disable-next-line object-curly-newline
const { throwServerError, generateAccessToken, login, signup, changePassword, logout } = require('../api/controllers/accounts');

describe('Accounts', () => {
    describe('throwServerError', () => {
        it('it should give something went wrong as a response', () => {
            const response = throwServerError(new MockExpressResponse());
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 500);
            assert.strictEqual(result.msg, 'Something went wrong.');
        });
    });

    describe('generateAccessToken', () => {
        it('it should generate token as a string', () => {
            const result = generateAccessToken('601bedf58cfd442160f8ca07');
            assert.isString(result);
        });
    });

    describe('login', () => {
        it('it should log in user', async () => {
            const req = {
                body: {
                    userName: 'kunal',
                    password: 'kunal123',
                },
            };
            const response = await login(req, new MockExpressResponse());
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
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 400);
            assert.strictEqual(result.msg, 'Username and password both are required.');
        });
    });

    describe('signup', () => {
        // As i am using original database for testing also,
        // i need to comment thing to avoid test failure
        /* it('it should sign up user', async () => {
            const req = {
                body: {
                    userName: 'dipen123',
                    password: 'dipen123',
                    confirmPassword: 'dipen123',
                },
            };
            const response = await signup(req, new MockExpressResponse());
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 200);
            assert.strictEqual(result.msg, 'Signed up successfully.');
        }); */

        it('it should show required msg', async () => {
            const req = {
                body: {
                    userName: 'dipen',
                    password: 'dipen123',
                },
            };
            const response = await signup(req, new MockExpressResponse());
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 400);
            assert.strictEqual(result.msg, 'Username,password and confirm password all are required.');
        });

        it('it should show password and confirm password should be same msg', async () => {
            const req = {
                body: {
                    userName: 'dipen',
                    password: 'dipen123',
                    confirmPassword: 'dipen1234',
                },
            };
            const response = await signup(req, new MockExpressResponse());
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 400);
            assert.strictEqual(result.msg, 'Password and confirm password both should be same.');
        });

        it('it should show username already taken msg', async () => {
            const req = {
                body: {
                    userName: 'dipen',
                    password: 'dipen123',
                    confirmPassword: 'dipen123',
                },
            };
            const response = await signup(req, new MockExpressResponse());
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 400);
            assert.strictEqual(result.msg, 'Username already taken.');
        });

        it('it should show password should contain at least 8 character msg', async () => {
            const req = {
                body: {
                    userName: 'you',
                    password: 'you',
                    confirmPassword: 'you',
                },
            };
            const response = await signup(req, new MockExpressResponse());
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 400);
            assert.strictEqual(result.msg, 'Password should contain at least 8 characters.');
        });

        it('it should show password should contain at most 16 character msg', async () => {
            const req = {
                body: {
                    userName: 'you',
                    password: 'you1234567890123456',
                    confirmPassword: 'you1234567890123456',
                },
            };
            const response = await signup(req, new MockExpressResponse());
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 400);
            assert.strictEqual(result.msg, 'Password should contain at most 16 characters.');
        });
    });

    describe('change password', () => {
        it('it should change the password of the user', async () => {
            const req = {
                user: {
                    userId: '6023a76329b23c0f54d9c6ea',
                },
                body: {
                    oldPassword: 'ridham12345',
                    newPassword: 'ridham12345',
                    confirmNewPassword: 'ridham12345',
                },
            };
            const response = await changePassword(req, new MockExpressResponse());
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 200);
            assert.strictEqual(result.msg, 'You changed password successfully.');
        });

        it('it should show required msg', async () => {
            const req = {
                user: {
                    userId: '6023a76329b23c0f54d9c6ea',
                },
                body: {
                    oldPassword: 'ridham123',
                    newPassword: 'ridham12345',
                },
            };
            const response = await changePassword(req, new MockExpressResponse());
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 400);
            assert.strictEqual(result.msg, 'Old password, new password and confirm new password all are required.');
        });

        it('it should show new password and confirm new password should be same msg', async () => {
            const req = {
                user: {
                    userId: '6023a76329b23c0f54d9c6ea',
                },
                body: {
                    oldPassword: 'ridham123',
                    newPassword: 'ridham12345',
                    confirmNewPassword: 'ridham123456',
                },
            };
            const response = await changePassword(req, new MockExpressResponse());
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 400);
            assert.strictEqual(result.msg, 'New password and confirm new password both should be same.');
        });

        it('it should show old password should be same msg', async () => {
            const req = {
                user: {
                    userId: '6023a76329b23c0f54d9c6ea',
                },
                body: {
                    oldPassword: 'ridham123',
                    newPassword: 'ridham12345',
                    confirmNewPassword: 'ridham12345',
                },
            };
            const response = await changePassword(req, new MockExpressResponse());
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 401);
            assert.strictEqual(result.msg, 'Old password should be correct.');
        });
    });

    /* describe('logout', () => {
        it('it should log out the user', async () => {
            const req = {
                headers: {
                    authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MDIzYTc2MzI5YjIzYzBmNTRkOWM2ZWEiLCJpYXQiOjE2MTMwMjM4MzYsImV4cCI6MTYxMzExMDIzNn0.fPTHC144fl6ydE5MuP4oSxgvW9_-whIK4Hym3oheLV8',
                },
            };
            const response = await logout(req, new MockExpressResponse());
            const result = response._getJSON();
            assert.strictEqual(response.statusCode, 200);
            assert.strictEqual(result.msg, 'You logged out successfully.');
        });
    }); */
});
