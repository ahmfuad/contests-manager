let expressSession = require('express-session');
let mongoose = require("mongoose");
let favicon = require('serve-favicon');
let MongoStore = require('connect-mongo')(expressSession);
let passport = require("passport");
let nconf = require("nconf");
let autoIncrement = require('mongoose-auto-increment');
let bodyParser = require('body-parser');
let express = require('express');
let fileUpload = require('express-fileupload');

module.exports = function (app) {
    mongoose.connect(global.__databaseUri);
    autoIncrement.initialize(mongoose.connection);

    app.use(expressSession({
        secret: 'top-secret',
        resave: true,
        saveUninitialized: true,
        store: new MongoStore({mongooseConnection: mongoose.connection })
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(fileUpload());

    app.use(express.static('public'));
    app.use(favicon("./public/favicon.ico"));
};