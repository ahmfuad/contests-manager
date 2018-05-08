module.exports = function (app) {
    require("./express.js")(app);
    require("./passport.js")(app);
};