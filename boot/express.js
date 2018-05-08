let expressSession = require('express-session');
let mongoose = require("mongoose");
let MongoStore = require('connect-mongo')(expressSession);
let passport = require("passport");
let nconf = require("nconf");
let autoIncrement = require('mongoose-auto-increment');
let bodyParser = require('body-parser');

module.exports = function (app) {
    mongoose.connect(nconf.get("database:uri"));
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

};