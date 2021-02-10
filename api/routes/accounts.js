const express = require('express');

// eslint-disable-next-line object-curly-newline
const { login, signup, changePassword, logout, getUserData } = require('../controllers/accounts');
const authenticateToken = require('../../middlewares/authenticate-token');

const router = express.Router();

router.post('/login', login);

router.post('/signup', signup);

router.put('/change-password', authenticateToken, changePassword);

router.delete('/logout', authenticateToken, logout);

// For learning purpose
router.post('/get-user-data', getUserData);

module.exports = router;
