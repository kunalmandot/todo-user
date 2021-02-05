const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const authenticateToken = require('../../middlewares/authenticate-token');
const User = require('../models/user');

const router = express.Router();

const generateAccessToken = userId => jwt.sign({userId}, "first application", {expiresIn: '24h'});
 
router.post('/login', async (req, res) => {
    const {userName, password} = req.body;
    if(!userName || !password) {
        return res.status(400).json({msg: 'Username and password both are required.'});
    }
    
    try {
        const userData = await User.findOne({$and: [{ userName }, { password }]});
        if(!userData) {
            return res.status(401).json({msg: 'Credentials were not matched.'});
        }
        token = generateAccessToken(userData._id);
        res.json({'msg': 'Logged in successfully.', token});
    } catch(err) {
        return res.status(500).json({msg: 'Something went wrong.'});
    }
});

router.post('/signup', async (req, res) => {
    const {userName, password, confirmPassword} = req.body;
    if(!userName || !password || !confirmPassword) {
        return res.status(400).json({msg: 'Username,password and confirm password all are required.'});
    }
    if(password !== confirmPassword) {
        return res.status(400).json({msg: "Password and confirm password both should be same."});
    }
    try {
        const user = new User({
            userName,
            password,
        });
        const savedUser = await user.save();
        if(savedUser) {
            return res.json({msg: 'Successfully Created', user: savedUser});
        }
    } catch(err) {
        if (err instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({msg: err.errors["password"].message});
        }
        if (err.name === "MongoError" && err.code === 11000) {
            return res.status(400).json({msg: 'Username already taken.'});
        }
        return res.status(500).json({msg: 'Something went wrong.'});    
    }
});

router.put('/change-password', authenticateToken, async (req,res) => {
    const {oldPassword, newPassword, confirmNewPassword} = req.body;
    if(!oldPassword || !newPassword || !confirmNewPassword) {
        return res.status(400).json({msg: 'Old password, new password and confirm new password all are required.'});
    }
    if(newPassword !== confirmNewPassword) {
        return res.status(400).json({msg: 'New password and confirm new password both should be same.'});
    }
    try {
        const user = await User.findById(req.user.userId);
        // console.log(user);
        if(user) {
            if(user.password !== oldPassword) {
                return res.status(400).json({msg: 'Old password should be correct.'})    
            }
            await User.updateOne({_id:req.user.userId}, {$set: {password: newPassword}});
            res.json({msg: 'You changed password successfully.'})
        }
    } catch(err) {
        return res.status(500).json({msg: 'Something went wrong.'});
    }
});

router.post('/get-user-data', async (req, res) => {
    const {uid1, uid2} = req.body;
    if(!uid1 || !uid2) {
        return res.status(400).json({msg: 'uid1 and uid2 both are required.'});
    }
    try {
        const result = await Promise.all([User.findById(uid1), User.findById(uid2)]);
        if(result) {
            res.json(result);
        }
    } catch(err) {
        return res.status(500).json({msg: 'Something went wrong.'});
    }
});

module.exports = router;