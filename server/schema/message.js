const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type:  mongoose.Schema.Types.ObjectId
    }
});

module.exports = mongoose.model('Message', MessageSchema);