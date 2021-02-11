const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const BlackListToken = require('../models/blackListToken');
const User = require('../models/user');

const throwServerError = (res) => res.status(500).json({ msg: 'Something went wrong.' });

const generateAccessToken = (userId) => jwt.sign({ userId }, 'first application', { expiresIn: '24h' });

const login = async (req, res) => {
    const { userName, password } = req.body;
    if (!userName || !password) {
        return res.status(400).json({ msg: 'Username and password both are required.' });
    }
    try {
        const userData = await User.findOne({ $and: [{ userName }, { password }] });
        if (!userData) {
            return res.status(401).json({ msg: 'Credentials were not matched.' });
        }
        const token = generateAccessToken(userData._id);
        return res.json({ msg: 'Logged in successfully.', token });
    } catch (err) {
        return throwServerError(res);
    }
};

const signup = async (req, res) => {
    const { userName, password, confirmPassword } = req.body;
    if (!userName || !password || !confirmPassword) {
        return res.status(400).json({ msg: 'Username,password and confirm password all are required.' });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ msg: 'Password and confirm password both should be same.' });
    }
    try {
        const user = new User({
            userName,
            password,
        });
        const savedUser = await user.save();
        if (savedUser) {
            return res.json({ msg: 'Signed up successfully.', user: savedUser });
        }
        return throwServerError(res);
    } catch (err) {
        if (err instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({ msg: err.errors.password.message });
        }
        if (err.name === 'MongoError' && err.code === 11000) {
            return res.status(400).json({ msg: 'Username already taken.' });
        }
        return throwServerError(res);
    }
};

const changePassword = async (req, res) => {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    if (!oldPassword || !newPassword || !confirmNewPassword) {
        return res.status(400).json({ msg: 'Old password, new password and confirm new password all are required.' });
    }
    if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ msg: 'New password and confirm new password both should be same.' });
    }
    try {
        const user = await User.findById(req.user.userId);
        // console.log(user);
        if (user) {
            if (user.password !== oldPassword) {
                return res.status(401).json({ msg: 'Old password should be correct.' });
            }
            await User.updateOne({ _id: req.user.userId }, { $set: { password: newPassword } });
            return res.json({ msg: 'You changed password successfully.' });
        }
        return throwServerError(res);
    } catch (err) {
        return throwServerError(res);
    }
};

const logout = async (req, res) => {
    try {
        const blackListToken = new BlackListToken({
            token: req.headers.authorization.split(' ')[1],
        });
        const savedBlackListToken = await blackListToken.save();
        if (savedBlackListToken) {
            return res.json({ msg: 'You logged out successfully.' });
        }
        return throwServerError(res);
    } catch (err) {
        return throwServerError(res);
    }
};

const getUserData = async (req, res) => {
    const { uid1, uid2 } = req.body;
    if (!uid1 || !uid2) {
        return res.status(400).json({ msg: 'uid1 and uid2 both are required.' });
    }
    try {
        const result = await Promise.all([User.findById(uid1), User.findById(uid2)]);
        if (result) {
            return res.json(result);
        }
        return throwServerError(res);
    } catch (err) {
        return throwServerError(res);
    }
};

module.exports = {
    throwServerError,
    generateAccessToken,
    login,
    signup,
    changePassword,
    logout,
    getUserData,
};
