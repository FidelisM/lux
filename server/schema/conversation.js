/*global require*/
const mongoose = require('mongoose'),
    messageModel = require('../schema/message');

const ConversationSchema = new mongoose.Schema({
    messages: {
        type: [messageModel]
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    members: {
        type: [String]
    }
}, {timestamps: true});

module.exports = mongoose.model('conversations', ConversationSchema);