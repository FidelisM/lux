/*global require, process*/

const express = require('express'),
    nodemailer = require('nodemailer');

const router = express.Router(),
    errorMessages = require('../errorMessages'),
    userModel = require('../schema/user');

router.get('/spoqn/friends', function (request, response) {
    let passport = router.getPassport();

    passport.authenticate('custom-jwt', function (err, loggedInUsername) {
        if (err) {
            return response.status(401).send({
                success: false,
                msg: errorMessages["401"].message
            });
        }

        getFriends(loggedInUsername, function (err, user) {
            if (err) {
                return response.send({
                    success: false,
                    msg: 'We were unable to get your friend list.' +
                    ' There was a problem accessing your profile.' +
                    ' Please try again later.'
                });
            }

            userModel.find({'email': {$in: user.friends}}, {'_id': 1, 'username': 1, 'email': 1},
                function (err, friends) {
                    return response.json({
                        success: true,
                        friends: friends
                    });
                });
        });
    })(request, response);
});

router.post('/spoqn/friends/add', function (request, response) {
    let passport = router.getPassport();

    passport.authenticate('custom-jwt', function (err, loggedInUsername) {
        if (err) {
            return response.status(401).send({
                success: false,
                msg: errorMessages["401"].message
            });
        }

        userModel.findOneAndUpdate({username: loggedInUsername}, {$push: {friends: request.body.friend}},
            {new: true}, function (err, user) {
                if (err) {
                    return response.send({
                        success: false,
                        msg: 'We were unable to add' + request.body.friend +
                        ' to your friend list. There was a problem accessing your profile. Please try again later.'
                    });
                }

                sendEmailInvite(request.body.friend, user.email, function (err) {
                    if (err) {
                        return response.json({
                            success: false,
                            msg: request.body.friend + ' has been added to your friend list. ' +
                            'But there was a problem sending an email invitation. Please try again later.'
                        });
                    }

                    return response.json({
                        success: true,
                        msg: request.body.friend + ' has been added to your friend list and' +
                        ' an email invitation has been sent.'
                    });
                });
            })

    })(request, response);
});

router.post('/spoqn/friends/email', function (request, response) {
    let passport = router.getPassport();

    passport.authenticate('custom-jwt', function (err, loggedInUsername) {
        if (err) {
            return response.status(401).send({
                success: false,
                msg: errorMessages["401"].message
            });
        }

        userModel.find({username: loggedInUsername}, function (err, user) {
            if (err) {
                return response.send({
                    success: false,
                    msg: 'There was a problem accessing your profile. Please try again later.'
                });
            }

            sendEmailInvite(request.body.friend, user.email, function (err) {
                if (err) {
                    return response.json({
                        success: false,
                        msg: 'There was a problem sending an email invitation to ' + request.body.friend +
                        '. Please try again later.'
                    });
                }

                return response.json({
                    success: true,
                    msg: 'An invitation has been sent to ' + request.body.friend
                });
            });
        })

    })(request, response);
});

getFriends = function (loggedInUsername, callback) {
    userModel.findOne({username: loggedInUsername}, callback);
};

sendEmailInvite = function (email, sender, callback) {
    let transporter = nodemailer.createTransport({
        host: 'mail.privateemail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_AUTH
        }
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Spoqn Invitation',
        text: 'You have been invited by ' + sender + ' to join the converation @ http://chat.spoqn.io'
    };

    return transporter.sendMail(mailOptions, callback);
};

module.exports = router;