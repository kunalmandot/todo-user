const express = require('express');
const jwt = require('jsonwebtoken');
const users = require('../../data/users');

const router = express.Router();

const generateAccessToken = userName => jwt.sign({userName}, "first application", {expiresIn: '24h'});

const authenticateUser = (userName, password) => {
    let token;
    for (let index = 0; index < users.length; index++) {
        if(users[index].userName === userName && users[index].password === password) {
            token = generateAccessToken(userName); 
            break; 
        }
    }
    return token;
    // users.forEach(user => {
    //     if(user.userName === userName && user.password === password) {
    //         return generateAccessToken(userName); 
           
    //     }
    // });
    // return token;
}
 
router.post('/login', (req, res) => {
    if(!req.body.userName || !req.body.password) {
        return res.status(400).json({msg: 'Username and password both are required.'});
    }
    
    const token = authenticateUser(req.body.userName, req.body.password);
    
    if(!token) {
        return res.status(401).json({msg: 'Credentials were not matched.'});
    }
    res.json({'msg': 'Logged in successfully.', token});
});

module.exports = router;