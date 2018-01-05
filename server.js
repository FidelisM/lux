/*global require*/

const express = require('express'),
    socket = require('socket.io'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    morgan = require('morgan'),

    strategy = require('./server/dbconfig/strategy'),
    config = require('./server/dbconfig/database'),
    authenticationRouter = require('./server/routes/authentication'),
    conversationRouter = require('./server/routes/conversation'),
    messengerRouter = require('./server/routes/messenger');

const app = express(),
    router = express.Router(),
    customRouters = [authenticationRouter, conversationRouter, messengerRouter],
    port = process.env.PORT || 3000;

var io;

router.use(express.static('dist'));
passport.use('custom-jwt', strategy);

mongoose.connect(config.database, {useMongoClient: true}).then(function () {
    app.use(morgan('dev'));

    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(bodyParser.json());
    app.use(passport.initialize());

    app.use(authenticationRouter);
    app.use(conversationRouter);
    app.use(messengerRouter);
    app.use(router);

    io = socket.listen(app.listen(port, function () {
        console.log('Server is running on port: ' + port);
    }));
}, function (err) {
    console.log(err);
});

mongoose.Promise = global.Promise;

for (let index = 0; index < customRouters.length; index++) {
    customRouters[index].getDB = function () {
        return mongoose.connection;
    };

    customRouters[index].getPassport = function () {
        return passport;
    };

    customRouters[index].getSocketIO = function () {
        return io;
    };
}
