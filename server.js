/*global require*/

const express = require('express'),
    socket = require('socket.io'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    morgan = require('morgan'),
    moment = require('moment'),

    strategy = require('./server/config/strategy'),
    config = require('./server/config/database'),
    authenticationRouter = require('./server/routes/authentication'),
    conversationRouter = require('./server/routes/conversation'),
    friendsRouter = require('./server/routes/friends'),
    userRouter = require('./server/routes/user'),
    conversationModel = require('./server/schema/conversation'),
    messageSchema = require('./server/schema/message'),
    messageModel = mongoose.model('message', messageSchema);

const app = express(),
    router = express.Router(),
    customRouters = [authenticationRouter, conversationRouter, friendsRouter, userRouter],
    port = process.env.PORT || 3000, jwt = require('jsonwebtoken');

let io;

router.use(express.static('dist'));
passport.use('custom-jwt', strategy);

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
    app.use(userRouter);
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
        socket.on('room', function (room) {
            socket.join(room);
        });

        socket.on('leave', function (room) {
            socket.leave(room);
        });

        socket.on('message', function (data) {
            let user = socket.decoded;

            data.message = messageModel({
                author: user.username,
                authorEmail: user.email,
                text: data.message,
                timestamp: moment().unix() * 1000
            });

            saveMessage(data, function (message) {
                socket.in(data.room).emit('new-message', data);
                socket.emit('new-message', data);
            });
        });
    });
}, function (err) {
    console.log(err);
});

mongoose.Promise = global.Promise;

saveMessage = function (data, callback) {
    let ObjectId = mongoose.Types.ObjectId,
        id = new ObjectId(data.room);

    conversationModel.findOneAndUpdate({_id: id}, {$push: {messages: data.message}}, callback)
};
