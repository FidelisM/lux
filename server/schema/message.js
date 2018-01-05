const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
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

module.exports = mongoose.model('Message', MessageSchema);