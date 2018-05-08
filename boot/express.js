let expressSession = require('express-session');
let mongoose = require("mongoose");
let MongoStore = require('connect-mongo')(expressSession);
let passport = require("passport");
let nconf = require("nconf");
let autoIncrement = require('mongoose-auto-increment');
let bodyParser = require('body-parser');
let express = require('express');

module.exports = function (app) {
    let databaseUri = process.argv.indexOf("--local") > -1 ? nconf.get("database:uri-local") : nconf.get("database:uri");

    mongoose.connect(databaseUri);
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
    app.use(express.static('public'))

};