/*global require*/

const express = require('express'),
    userSchema = require('../schema/user'),
    config = require('../config/database'),
    jwt = require('jsonwebtoken');

const router = express.Router();

router.get('/spoqn/refresh', function (request, response) {
    let token = getToken(request.headers),
        browser = request.headers.browser,
        db = router.getDB();

    if (token) {
        jwt.verify(token, config.secret, handleSuccess);
    } else {
        return response.status(401).send({
            success: false,
            msg: 'Please login to view this content.'
        });
    }

    function handleSuccess(err, decoded) {
        if (err) {
            return response.status(401).send({
                success: false,
                msg: 'Your session has expired, please log in to continue.'
            });
        }

        if ((decoded.username && decoded.password) && (decoded.browser === browser)) {
            db.collection('users').findOne({username: decoded.username}, function (err, result) {
                let user = new userSchema(result);

                user.comparePassword(decoded.password, function (err, isMatch) {
                    if (isMatch && !err) {
                        let token = jwt.sign({
                            username: decoded.username,
                            password: decoded.password,
                            browser: decoded.browser
                        }, config.secret, {
                            expiresIn: 3600 // in seconds
                        });

                        response.json({
                            success: true,
                            username: decoded.username,
                            msg: 'Welcome back!',
                            token: 'Bearer ' + token
                        });
                    } else {
                        return response.status(401).send({
                            success: false,
                            msg: 'Your session has expired, please log in to continue.'
                        });
                    }
                });
            })
        } else {
            return response.status(401).send({
                success: false,
                msg: 'Your session has expired, please log in to continue.'
            });
        }
    }
});

router.post('/spoqn/register', function (request, response) {
    if (request.body.email && request.body.username && request.body.password && request.body.browser) {
        let userData = {
                email: request.body.email,
                username: request.body.username,
                password: request.body.password,
                telephone: request.body.tel
            },
            user = new userSchema(userData);

        user.save(userData, (err) => {
            if (err) {
                return response.send({
                    success: false,
                    msg: 'Registration failed.'
                });
            }

            let token = jwt.sign({
                username: request.body.username,
                password: request.body.password,
                browser: request.body.browser
            }, config.secret, {
                expiresIn: 3600 // in seconds
            });

            response.send({
                success: true,
                msg: 'Registration successful. Welcome to spoqn.',
                username: request.body.username,
                token: 'Bearer ' + token
            });
        })
    } else {
        response.send(500);
    }
});

router.post('/spoqn/login', function (request, response) {
    if (request.body.username && request.body.password && request.body.browser) {
        let db = router.getDB();

        db.collection('users').findOne({username: request.body.username}, function (err, result) {
            let user = new userSchema(result);

            user.comparePassword(request.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // Create token if the password matched and no error was thrown
                    let token = jwt.sign({
                        username: request.body.username,
                        password: request.body.password,
                        browser: request.body.browser
                    }, config.secret, {
                        expiresIn: 3600 // in seconds
                    });

                    response.json({
                        success: true,
                        username: request.body.username,
                        msg: 'Welcome to spoqn.',
                        token: 'Bearer ' + token
                    });
                } else {
                    response.send({
                        success: false,
                        msg: 'Authentication failed. Username or password is incorrect.'
                    });
                }
            });
        })
    } else {
        response.send(500);
    }
});

getToken = function (headers) {
    if (headers && headers.authorization) {
        let parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

module.exports = router;