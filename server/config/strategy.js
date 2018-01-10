/*global require*/

const CustomStrategy = require('passport-custom').Strategy,
    jwt = require('jsonwebtoken');

const config = require('./database');

const strategy = new CustomStrategy(
    function (request, done) {
        let token = getToken(request.headers);
        if (token) {
            jwt.verify(token, config.secret, function (err, decoded) {
                (err) ? done(err) : done(err, decoded.username);
            });
        }
    }
);

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

module.exports = strategy;