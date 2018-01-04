const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    morgan = require('morgan'),

    strategy = require('./server/dbconfig/strategy'),
    config = require('./server/dbconfig/database'),
    authRouter = require('./server/routes/auth'),
    convoRouter = require('./server/routes/convo');

const app = express(),
    router = express.Router(),
    customRouters = [authRouter, convoRouter],
    port = process.env.PORT || 3000;

router.use(express.static('dist'));
passport.use('custom-jwt', strategy);


mongoose.connect(config.database, {useMongoClient: true}).then(function () {
    app.use(morgan('dev'));

    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(bodyParser.json());
    app.use(passport.initialize());

    app.use(authRouter);
    app.use(convoRouter);
    app.use(router);

    app.listen(port, function () {
        console.log('Server is running on port: ' + port);
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
}
