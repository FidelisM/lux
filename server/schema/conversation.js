/*global require*/
const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    messages: {
        type: [String]
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

module.exports = mongoose.model('Conversations', ConversationSchema);