/*global require*/

const express = require('express'),
    userModel = require('../schema/user'),
    config = require('../config/database'),
    errorMessages = require('../errorMessages'),
    jwt = require('jsonwebtoken');

const router = express.Router();


router.post('/spoqn/user/update', function (request, response) {
    let passport = router.getPassport(),
        updates = {},
        userModel;

    passport.authenticate('custom-jwt', function (err, loggedInUsername, user) {
        if (err) {
            return response.status(401).send({
                success: false,
                msg: errorMessages["401"].message
            });
        }

        if (request.body.username) {
            updates.username = request.body.username;
        }

        if (request.body.telephone) {
            updates.telephone = request.body.telephone;
        }

        if (request.body.currentPassword && request.body.password) {
            userModel.findOne({'username': user.username}, (err, user) => {
                userModel = new userModel(user);
                userModel.comparePassword(request.body.currentPassword, function (err, isMatch) {
                    if (!isMatch && err) {
                        return response.send({
                            success: false,
                            msg: 'Updates failed. Your password is incorrect.'
                        });
                    }

                    updates.password = request.body.password;
                    updateUser(user.username, updates, request, response);
                });
            })
        } else {
            updateUser(user.username, updates, request, response);
        }

    })(request, response);
});

const updateUser = function (username, updates, request, response) {
    userModel.findOne({'username': username}, (err, user) => {
        user = Object.assign(user, updates);

        user.save(function (err, user) {
            if (err) {
                return response.send({
                    success: false,
                    msg: 'Updates failed. There was a problem accessing your user.'
                });
            }

            issueNewToken(request, response, user);
        });
    });
};


const issueNewToken = function (request, response, user) {
    let token = jwt.sign({
        username: user.username,
        password: request.body.currentPassword,
        browser: request.headers.browser
    }, config.secret, {
        expiresIn: 3600
    });

    response.send({
        success: true,
        user: {
            email: user.email,
            username: user.username,
            telephone: user.telephone
        },
        msg: 'Updates successful.',
        token: 'Bearer ' + token
    });
};

module.exports = router;