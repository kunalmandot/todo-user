const jwt = require('jsonwebtoken');
const BlackListToken = require('../api/models/blackListToken');

const throwServerError = (res) => res.status(500).json({ msg: 'Something went wrong.' });

// eslint-disable-next-line consistent-return
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(400).json({ msg: "There wasn't exist any token." });
    }
    const token = authHeader.split(' ')[1];

    try {
        const blackListedToken = await BlackListToken.findOne({ token });
        if (blackListedToken) {
            return res.status(400).json({ msg: 'Your token is already destroyed.' });
        }
        // eslint-disable-next-line consistent-return
        jwt.verify(token, 'first application', (err, user) => {
            if (err) {
                return res.status(403).json({ msg: 'Token mismatch occurred.' });
            }
            req.user = user;
            next();
        });
    } catch (err) {
        return throwServerError(res);
    }
};

module.exports = authenticateToken;
