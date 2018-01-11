/*global require, process*/

const express = require('express'),
    nodemailer = require('nodemailer');

const router = express.Router(),
    errorMessages = require('../errorMessages');

router.get('/spoqn/friends', function (request, response) {
    let db = router.getDB(),
        passport = router.getPassport();

    passport.authenticate('custom-jwt', function (err, loggedInUsername) {
        if (err) {
            return response.status(401).send({
                success: false,
                msg: errorMessages["401"].message
            });
        }

        getFriends(db, loggedInUsername, function (user) {
            db.collection('users').find({
                'email': {
                    $in: user.friends
                }
            }, {
                fields: {
                    '_id': 1,
                    'username': 1,
                    'email': 1
                }
            }, function (err, friends) {
                friends.toArray(function (err, friendsArray) {
                    return response.json({
                        success: true,
                        friends: friendsArray
                    });
                })
            });
        });
    })(request, response);
});

router.post('/spoqn/friends/add', function (request, response) {
    let db = router.getDB(),
        passport = router.getPassport();

    passport.authenticate('custom-jwt', function (err, loggedInUsername) {
        if (err) {
            return response.status(401).send({
                success: false,
                msg: errorMessages["401"].message
            });
        }

        db.collection('users').findOneAndUpdate({username: loggedInUsername}, {$push: {friends: request.body.friend}},
            {new: true}, function (err, result) {
                let user = result.value;

                if (err) {
                    return response.send({
                        success: false,
                        msg: 'There was a problem with your request. We were unable to add' + request.body.friend +
                        ' to your friend list. Please try again.'
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
    let db = router.getDB(),
        passport = router.getPassport();

    passport.authenticate('custom-jwt', function (err, loggedInUsername) {
        if (err) {
            return response.status(401).send({
                success: false,
                msg: errorMessages["401"].message
            });
        }

        db.collection('users').find({username: loggedInUsername}, function (err, user) {
            if (err) {
                return response.send({
                    success: false,
                    msg: 'We were unable to find your profile.'
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

getFriends = function (db, loggedInUsername, callback) {
    db.collection('users').findOne({username: loggedInUsername}, function (err, user) {
        callback(user);
    });
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