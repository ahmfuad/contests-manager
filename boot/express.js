let expressSession = require('express-session');
let mongoose = require("mongoose");
let MongoStore = require('connect-mongo')(expressSession);
let passport = require("passport");
let nconf = require("nconf");

module.exports = function (app) {
    mongoose.connect(nconf.get("database:local-uri"));

    app.use(expressSession({
        secret: 'top-secret',
        resave: true,
        saveUninitialized: true,
        store: new MongoStore({mongooseConnection: mongoose.connection })
    }));

    app.use(passport.initialize());
    app.use(passport.session());

};