const mongoose = require('mongoose');

const TodoSchema = mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
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

TodoSchema.index({ createdBy: 1, title: 1}, { unique: true });

module.exports = mongoose.model('Todo', TodoSchema);