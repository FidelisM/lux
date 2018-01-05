/*global require*/

const express = require('express'),
    mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    moment = require('moment'),
    config = require('../dbconfig/database'),
    messageSchema = require('../schema/message');

const router = express.Router();

router.get('/spoqn/messenger/open/:id', function (request, response) {
    let db = router.getDB(),
        passport = router.getPassport();

    passport.authenticate('custom-jwt', function (err) {
        if (err) {
            return response.status(401).send({
                success: false,
                msg: 'Unauthorized.'
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
                socket.on('message', function (data, acknowledgement) {
                    let user = socket.decoded,
                        messageObj = {
                            author: user.username,
                            text: data.message,
                            timestamp: moment().unix() * 1000
                        };

                    data.message = new messageSchema(messageObj);

                    saveMessage(db, data, function () {
                        getMessages(db, data, function (err, convosList) {
                            acknowledgement({
                                success: true,
                                messages: (convosList[0] && convosList[0].messages) || []
                            });
                        })
                    });
                });
            });

            getMessages(db, {room: request.params.id}, function (err, convosList) {
                response.json({
                    success: true,
                    messages: (convosList[0] && convosList[0].messages) || []
                });
            });
        } else {
            getMessages(db, {room: request.params.id}, function (err, convosList) {
                response.json({
                    success: true,
                    messages: (convosList[0] && convosList[0].messages) || []
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