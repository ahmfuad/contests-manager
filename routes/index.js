module.exports = function (app) {
    require("./user.js")(app);
    require("./contests.js")(app);
    require("./works.js")(app);
};