/*global require*/
const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    messages: {
        type: Array
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Conversations', ConversationSchema);