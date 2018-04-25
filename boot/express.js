let expressSession = require('express-session');
let mongoose = require("mongoose");
let MongoStore = require('connect-mongo')(expressSession);
let passport = require("passport");
let nconf = require("nconf");
let autoIncrement = require('mongoose-auto-increment');

module.exports = function (app) {
    let connection = mongoose.createConnection(nconf.get("database:uri"));
    autoIncrement.initialize(connection);

    app.get("/test1", (req, res)=>res.send("test"));

    app.use(expressSession({
        secret: 'top-secret',
        resave: true,
        saveUninitialized: true,
        store: new MongoStore({mongooseConnection: mongoose.connection })
    }));
    app.get("/test2", (req, res)=>res.send("test"));
    app.use(passport.initialize());
    app.use(passport.session());

};