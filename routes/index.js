module.exports = function (app) {
    require("./auth.js")(app);
    require("./main.js")(app);
};