/*global require*/

const express = require('express');

const router = express.Router(),
    convoSchema = require('../schema/conversation'),
    messageSchema = require('../schema/message');

router.get('/lux/convo', function (request, response) {
    let db = router.getDB(),
        passport = router.getPassport();

    passport.authenticate('custom-jwt', function (err, loggedInUsername) {
        if (err) {
            return response.status(401).send({
                success: false,
                msg: 'Unauthorized.'
            });
        }
        db.collection('users').findOne({username: loggedInUsername}, function (err, creator) {
            db.collection('conversations').find({creator: creator._id}, {
                    fields: {
                        '_id': 1,
                        'name': 1,
                        'updatedAt': 1
                    }
                },
                function (err, convos) {
                    convos.toArray(function (err, convosList) {
                        response.json({
                            success: true,
                            rooms: convosList || [],
                        });
                    });
                });
        });
    })(request, response);
});

router.post('/lux/convo/create', function (request, response) {
    let db = router.getDB(),
        passport = router.getPassport(),
        convoObj = {
            messages: []
        };

    passport.authenticate('custom-jwt', function (err, loggedInUsername) {
        if (err) {
            return response.status(401).send({
                success: false,
                msg: 'Unauthorized.'
            });
        }

        db.collection('users').findOne({username: loggedInUsername}, function (err, creator) {
            convoObj.creator = creator._id;
            convoObj.name = request.body.name;

            let convo = new convoSchema(convoObj);

            convo.save(convoObj, (err) => {
                if (err) {
                    return response.send({
                        success: false,
                        message: 'Failed to create conversation'
                    });
                }

                db.collection('conversations').find({creator: creator._id}, {
                        fields: {
                            '_id': 1,
                            'name': 1,
                            'updatedAt': 1
                        }
                    },
                    function (err, convos) {
                        convos.toArray(function (err, convosList) {
                            response.json({
                                success: true,
                                rooms: convosList
                            });
                        });
                    });
            });
        });

    })(request, response);
});

router.post('/lux/convo/update', function (request, response) {
    let db = router.getDB(),
        passport = router.getPassport(),
        messageObj = {
            author: request.body.userID,
            text: request.body.text
        },
        message = new messageSchema(messageObj);

    passport.authenticate('custom-jwt', function (err) {
        if (err) {
            return response.status(401).send({
                success: false,
                msg: 'Unauthorized.'
            });
        }

        db.collection('conversations'.findOne({id: request.body.convoID}, function (err, results) {
            if (err) {
                return response.send({
                    success: false,
                    err: err
                });
            }

            debugger
            db.collection('conversations').update({id: request.body.convoID}, {$push: {messages: message}}, function () {
                db.collection('conversations'.findOne({id: request.body.convoID}, function (err, results) {
                    if (err) {
                        return response.send({
                            success: false,
                            err: err
                        });
                    }

                    return response.send({
                        success: true,
                        messages: results
                    });
                }));
            });
        }));
    });
});

router.get('/lux/convo/:id', function (request, response) {
    let db = router.getDB(),
        passport = router.getPassport();

    passport.authenticate('custom-jwt', function (err) {
        if (err) {
            return response.status(401).send({
                success: false,
                msg: 'Unauthorized.'
            });
        }

        db.collection('conversations'.findOne({username: request.query.id}, function (err, results) {
            response.json({
                success: true,
                data: results
            });
        }));
    });
});

module.exports = router;