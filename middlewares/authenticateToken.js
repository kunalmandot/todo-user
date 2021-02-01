const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({'msg': "There wastn't exist any token."});
    }
    jwt.verify(token, "first application", (err, user) => {
        if (err) {
            console.log(err, username)
            return res.status(403).json({'msg': 'Token mismatch occured.'});
        }
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;