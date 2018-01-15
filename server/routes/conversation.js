/*global require*/

const express = require('express'),
    mongoose = require('mongoose');

const router = express.Router(),
    conversationModel = require('../schema/conversation'),
    userModel = require('../schema/user'),
    errorMessages = require('../errorMessages');

router.get('/spoqn/convo', function (request, response) {
    let passport = router.getPassport();

    passport.authenticate('custom-jwt', function (err, loggedInUsername) {
        if (err) {
            return response.status(401).send({
                success: false,
                msg: errorMessages["401"].message
            });
        }
        userModel.findOne({username: loggedInUsername}, function (err, creator) {
            if (err) {
                return response.send({
                    success: false,
                    msg: 'We were unable to get your list of rooms.' +
                    ' There was a problem accessing your profile.' +
                    ' Please try again later.'
                });
            }

            conversationModel.find({members: {$eq: creator.email}}, {'_id': 1, 'name': 1, 'updatedAt': 1},
                function (err, convos) {
                    if (err) {
                        return response.send({
                            success: false,
                            msg: 'We were unable to get your list of rooms.' +
                            ' There was a problem accessing your profile.' +
                            ' Please try again later.'
                        });
                    }

                    response.json({
                        success: true,
                        rooms: convos || [],
                    });
                });
        });
    })(request, response);
});

router.post('/spoqn/convo/create', function (request, response) {
    let passport = router.getPassport(),
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

        userModel.findOne({username: loggedInUsername}, function (err, creator) {
            convoObj.creator = creator._id;
            convoObj.name = request.body.name;
            convoObj.members = [creator.email];

            let convo = new conversationModel(convoObj);

            convo.save(convoObj, (err) => {
                if (err) {
                    return response.send({
                        success: false,
                        msg: 'Failed to create ' + request.body.name + '. Please try again.'
                    });
                }

                conversationModel.find({creator: creator._id}, {'_id': 1, 'name': 1, 'updatedAt': 1},
                    function (err, convos) {
                        if (err) {
                            return response.send({
                                success: false,
                                msg: request.body.name + ' has been created.' +
                                ' But we were unable to get your new list of rooms.' +
                                ' Please try again later.'
                            });
                        }

                        response.json({
                            success: true,
                            rooms: convos,
                            msg: request.body.name + ' has been created.'
                        });
                    });
            });
        });

    })(request, response);
});

router.post('/spoqn/convo/members/add', function (request, response) {
    let passport = router.getPassport();

    passport.authenticate('custom-jwt', function (err) {
        if (err) {
            return response.status(401).send({
                success: false,
                msg: errorMessages["401"].message
            });
        }

        let ObjectId = mongoose.Types.ObjectId,
            id = new ObjectId(request.body.roomID);

        conversationModel.findOneAndUpdate({_id: id}, {$push: {members: request.body.member.email}}, function (err, result) {
            if (err) {
                return response.json({
                    success: false,
                    msg: 'We were unable add ' + request.body.member.email + ' to ' + result.name + '. Please try again later.'
                });
            }

            getMessages({room: request.body.roomID}, function (err, convosList) {
                response.json({
                    success: true,
                    members: (convosList[0] && convosList[0].members) || [],
                    msg: request.body.member.email + ' has been added to ' + result.name + '.'
                });
            });
        })

    })(request, response);
});

router.post('/spoqn/convo/members/remove', function (request, response) {
    let passport = router.getPassport();

    passport.authenticate('custom-jwt', function (err) {
        if (err) {
            return response.status(401).send({
                success: false,
                msg: errorMessages["401"].message
            });
        }

        let ObjectId = mongoose.Types.ObjectId,
            id = new ObjectId(request.body.roomID);

        conversationModel.findOneAndUpdate({_id: id}, {$pull: {members: request.body.member.email}}, function (err, result) {
            if (err) {
                return response.json({
                    success: false,
                    msg: 'We were unable to remove ' + request.body.member.email + ' from ' + result.value.name + '. Please try again later.'
                });
            }

            getMessages({room: request.body.roomID}, function (err, convosList) {
                response.json({
                    success: true,
                    members: (convosList[0] && convosList[0].members) || [],
                    msg: request.body.member.email + ' has been removed from ' + result.value.name + '.'
                });
            });
        })

    })(request, response);
});

router.get('/spoqn/convo/members/:id', function (request, response) {
    let passport = router.getPassport();

    passport.authenticate('custom-jwt', function (err) {
        if (err) {
            return response.status(401).send({
                success: false,
                msg: errorMessages["401"].message
            });
        }

        getMessages({room: request.params.id}, function (err, convosList) {
            response.json({
                success: true,
                members: (convosList[0] && convosList[0].members) || []
            });
        });
    })(request, response);
});

router.get('/spoqn/convo/messages/:id', function (request, response) {
    let passport = router.getPassport();

    passport.authenticate('custom-jwt', function (err) {
        if (err) {
            return response.status(401).send({
                success: false,
                msg: errorMessages["401"].message
            });
        }

        getMessages({room: request.params.id}, function (err, convosList) {
            response.json({
                success: true,
                messages: (convosList[0] && convosList[0].messages) || []
            });
        });
    })(request, response);
});

getMessages = function (data, callback) {
    let ObjectId = mongoose.Types.ObjectId,
        id = new ObjectId(data.room);

    conversationModel.find({_id: id}, callback);
};

module.exports = router;