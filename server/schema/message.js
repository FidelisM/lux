const mongoose = require('mongoose');

const messageModel = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    timestamp: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('message', messageModel);