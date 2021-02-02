const express = require('express');
const jwt = require('jsonwebtoken');
const users = require('../../data/users');

const router = express.Router();

const generateAccessToken = userName => jwt.sign({userName}, "first application", {expiresIn: '1800s'});

const authenticateUser = (userName, password) => {
    let token;
    users.forEach(user => {
        if(user.userName === userName && user.password === password) {
            token = generateAccessToken(userName);        
        }
    });
    return token;
}
 
router.post('/login', (req, res) => {
    if(!req.body.userName || !req.body.password) {
        return res.status(400).json({'msg': 'Username and password both are required.'});
    }
    
    const token = authenticateUser(req.body.userName, req.body.password);
    
    if(!token) {
        return res.status(401).json({'msg': 'Credentials were not matched.'});
    }
    res.json({'msg': 'Logged in successfully.', token});
});

module.exports = router;