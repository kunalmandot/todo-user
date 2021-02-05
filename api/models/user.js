const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: [8, 'Password should contain at least 8 characters.'],
        maxLength: [16, 'Password should contain at most 16 characters.']
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    },
    isSuperAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    lastModifiedAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);