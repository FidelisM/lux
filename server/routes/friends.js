/*global require*/

const express = require('express');

const router = express.Router();

router.get('/spoqn/friends', function (request, response) {
    let db = router.getDB(),
        passport = router.getPassport();

    passport.authenticate('custom-jwt', function (err, loggedInUsername) {
        if (err) {
            return response.status(401).send({
                success: false,
                msg: 'Unauthorized.'
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
                msg: 'Unauthorized.'
            });
        }

        db.collection('users').findOneAndUpdate({username: loggedInUsername}, {$push: {friends: request.body.friend}}, function (err) {
            if (err) {
                return response.status(401).send({
                    success: false,
                    msg: 'Unauthorized.'
                });
            }

            return response.json({
                success: true,
                msg: 'Member Added.'
            });
        })

    })(request, response);
});

getFriends = function (db, loggedInUsername, callback) {
    db.collection('users').findOne({username: loggedInUsername}, function (err, user) {
        callback(user);
    });
};

module.exports = router;