/*global require*/

const express = require('express'),
    mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    moment = require('moment');

const router = express.Router(),
    errorMessages = require('../errorMessages'),
    config = require('../config/database'),
    messageModel = require('../schema/message');

router.get('/spoqn/messenger/open/:id', function (request, response) {
    let db = router.getDB(),
        passport = router.getPassport();

    passport.authenticate('custom-jwt', function (err) {
        if (err) {
            return response.status(401).send({
                success: false,
                msg: errorMessages["401"].message
            });
        }

        let io = router.getSocketIO(),
            namespace;

        if (!io.nsps.hasOwnProperty('/spoqn/messenger/' + request.params.id) && request.params.id) {
            namespace = io.of('/spoqn/messenger/' + request.params.id);

            namespace.use(function (socket, next) {
                if (socket.handshake.query && socket.handshake.query.token) {
                    jwt.verify(socket.handshake.query.token.split(' ')[1], config.secret, function (err, decoded) {
                        if (err) return next(new Error('Authentication error'));
                        socket.decoded = decoded;
                        next();
                    });
                }
                next(new Error('Authentication error'));
            });

            namespace.on('connection', function (socket) {
                socket.on('message', function (data) {
                    let user = socket.decoded,
                        messageObj = {
                            author: user.username,
                            text: data.message,
                            timestamp: moment().unix() * 1000
                        };

                    data.message = new messageModel(messageObj);

                    saveMessage(db, data, function () {
                        namespace.emit('new-message');
                    });
                });
            });
        }
    })(request, response);
});

getMessages = function (db, data, callback) {
    let ObjectId = mongoose.Types.ObjectId,
        id = new ObjectId(data.room);

    db.collection('conversations').find({_id: id}, function (err, convos) {
        convos.toArray(callback);
    });
};

saveMessage = function (db, data, callback) {
    let ObjectId = mongoose.Types.ObjectId,
        id = new ObjectId(data.room);

    db.collection('conversations').findOneAndUpdate({_id: id}, {$push: {messages: data.message}}, function (err, convosList) {
        callback(err, convosList)
    })
};

module.exports = router;