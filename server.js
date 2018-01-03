const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    morgan = require('morgan'),

    strategy = require('./server/dbconfig/strategy'),
    config = require('./server/dbconfig/database'),
    authRouter = require('./server/routes/auth');

const app = express(),
      router = express.Router(),
      port = process.env.PORT || 3000;

router.use(express.static('dist'));
passport.use(strategy);

mongoose.connect(config.database, {useMongoClient: true}).then(function () {
    app.use(morgan('dev'));

    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(bodyParser.json());
    app.use(passport.initialize());

    app.use(router);
    app.use(authRouter);
    
    app.listen(port, function () {
        console.log('Server is running on port: ' + port)
    });
}, function (err) {
    console.log(err);
});

mongoose.Promise = global.Promise;

authRouter.getDB = function () {
    return mongoose.connection;
};
