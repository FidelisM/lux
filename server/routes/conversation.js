/*global require*/

const express = require('express'),
    mongoose = require('mongoose');

const router = express.Router(),
    convoSchema = require('../schema/conversation'),
    errorMessages = require('../errorMessages');

router.get('/spoqn/convo', function (request, response) {
    let db = router.getDB(),
        passport = router.getPassport();

    passport.authenticate('custom-jwt', function (err, loggedInUsername) {
        if (err) {
            return response.status(401).send({
                success: false,
                msg: errorMessages["401"].message
            });
        }
        db.collection('users').findOne({username: loggedInUsername}, function (err, creator) {
            let ObjectId = mongoose.Types.ObjectId,
                id = new ObjectId(creator._id);

            //$or: [{creator: id}, {members: creator.email}]
            db.collection('conversations').find({members: {$eq: creator.email}}, {
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

router.post('/spoqn/convo/create', function (request, response) {
    let db = router.getDB(),
        passport = router.getPassport(),
        convoObj = {
            messages: []
        };

    passport.authenticate('custom-jwt', function (err, loggedInUsername) {
        if (err) {
            return response.status(401).send({
                success: false,
                msg: errorMessages["401"].message
            });
        }

        db.collection('users').findOne({username: loggedInUsername}, function (err, creator) {
            convoObj.creator = creator._id;
            convoObj.name = request.body.name;
            convoObj.members = [creator.email];

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

router.post('/spoqn/convo/member/add', function (request, response) {
    let db = router.getDB(),
        passport = router.getPassport();

    passport.authenticate('custom-jwt', function (err) {
        if (err) {
            return response.status(401).send({
                success: false,
                msg: errorMessages["401"].message
            });
        }

        let ObjectId = mongoose.Types.ObjectId,
            id = new ObjectId(request.body.roomID);

        db.collection('conversations').findOneAndUpdate({_id: id}, {$push: {members: request.body.member.email}}, function (err) {
            if (err) {
                return response.json({
                    success: true,
                    msg: 'Could Not Add Member To Conversation. ' + err.toString()
                });
            }

            getMessages(db, {room: request.body.roomID}, function (err, convosList) {
                response.json({
                    success: true,
                    members: (convosList[0] && convosList[0].members) || []
                });
            });
        })

    })(request, response);
});

router.post('/spoqn/convo/member/remove', function (request, response) {
    let db = router.getDB(),
        passport = router.getPassport();

    passport.authenticate('custom-jwt', function (err) {
        if (err) {
            return response.status(401).send({
                success: false,
                msg: errorMessages["401"].message
            });
        }

        let ObjectId = mongoose.Types.ObjectId,
            id = new ObjectId(request.body.roomID);

        db.collection('conversations').findOneAndUpdate({_id: id}, {$pull: {members: request.body.member.email}}, function (err) {
            if (err) {
                return response.json({
                    success: true,
                    msg: 'Could Not Remove Member From Conversation. ' + err.toString()
                });
            }

            getMessages(db, {room: request.body.roomID}, function (err, convosList) {
                response.json({
                    success: true,
                    members: (convosList[0] && convosList[0].members) || []
                });
            });
        })

    })(request, response);
});

router.get('/spoqn/convo/member/:id', function (request, response) {
    let db = router.getDB(),
        passport = router.getPassport();

    passport.authenticate('custom-jwt', function (err) {
        if (err) {
            return response.status(401).send({
                success: false,
                msg: errorMessages["401"].message
            });
        }

        getMessages(db, {room: request.params.id}, function (err, convosList) {
            response.json({
                success: true,
                members: (convosList[0] && convosList[0].members) || []
            });
        });
    })(request, response);
});

router.get('/spoqn/convo/:id', function (request, response) {
    let db = router.getDB(),
        passport = router.getPassport();

    passport.authenticate('custom-jwt', function (err) {
        if (err) {
            return response.status(401).send({
                success: false,
                msg: errorMessages["401"].message
            });
        }

        getMessages(db, {room: request.params.id}, function (err, convosList) {
            response.json({
                success: true,
                messages: (convosList[0] && convosList[0].messages) || []
            });
        });
    })(request, response);
});

getMessages = function (db, data, callback) {
    let ObjectId = mongoose.Types.ObjectId,
        id = new ObjectId(data.room);

    db.collection('conversations').find({_id: id}, function (err, convos) {
        convos.toArray(callback);
    });
};

module.exports = router;