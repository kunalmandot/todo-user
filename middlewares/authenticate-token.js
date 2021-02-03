const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({msg: "There wasn't exist any token."});
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, "first application", (err, user) => {
        if (err) {
            return res.status(403).json({msg: 'Token mismatch occurred.'});
        }
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;