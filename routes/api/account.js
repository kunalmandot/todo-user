const express = require('express');
const jwt = require('jsonwebtoken');
const users = require('../../data/users');

const router = express.Router();

function generateAccessToken(username) {
    return jwt.sign({username}, "first application", );
}
 
router.post('/login', (req, res) => {
    if(!req.body.username || !req.body.password) {
        return res.status(400).json({'msg': 'Username and password both are required.'});
    }
    
    let token;
    users.forEach(user => {
        if(user.username === req.body.username && user.password === req.body.password) {
            token = generateAccessToken(user.username);
            return res.json({'msg': 'Logged in sucessfully.', token});
        }
    });
    
    if(!token) {
        res.status(401).json({'msg': 'Credentials were not matched.'});
    }
});

module.exports = router;