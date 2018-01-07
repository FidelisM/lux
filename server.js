/*global require*/

const express = require('express'),
    socket = require('socket.io'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    morgan = require('morgan'),
    moment = require('moment'),

    strategy = require('./server/dbconfig/strategy'),
    config = require('./server/dbconfig/database'),
    authenticationRouter = require('./server/routes/authentication'),
    conversationRouter = require('./server/routes/conversation'),
    friendsRouter = require('./server/routes/friends'),
    messageSchema = require('./server/schema/message');

const app = express(),
    router = express.Router(),
    customRouters = [authenticationRouter, conversationRouter, friendsRouter],
    port = process.env.PORT || 3000, jwt = require('jsonwebtoken');

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
    app.use(friendsRouter);
    app.use(router);

    io = socket.listen(app.listen(port, function () {
        console.log('Server is running on port: ' + port);
    }));

    let namespace = io.of('/spoqn/messenger/chat');

    namespace.use(function (socket, next) {
        if (socket.handshake.query && socket.handshake.query.token) {
            jwt.verify(socket.handshake.query.token.split(' ')[1], config.secret, function (err, decoded) {
                if (err) return next(new Error('Authentication error'));
                socket.decoded = decoded;
                next();
            });
        }
        next(new Error('Authentication error'));
    });

    namespace.on('connection', function (socket) {
        socket.on('room', function(room) {
            socket.join(room);
        });

        socket.on('leave', function(room) {
            socket.leave(room);
        });

        socket.on('message', function (data) {
            let user = socket.decoded,
                messageObj = {
                    author: user.username,
                    text: data.message,
                    timestamp: moment().unix() * 1000
                };

            data.message = new messageSchema(messageObj);

            saveMessage(data, function () {
                socket.in(data.room).emit('new-message');
            });
        });
    });
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

saveMessage = function (data, callback) {
    let ObjectId = mongoose.Types.ObjectId,
        id = new ObjectId(data.room),
        db = mongoose.connection;

    db.collection('conversations').findOneAndUpdate({_id: id}, {$push: {messages: data.message}}, function (err, convosList) {
        callback(err, convosList)
    })
};
