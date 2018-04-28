module.exports = function (app) {
    require("./auth.js")(app);
    require("./contests.js")(app);
};