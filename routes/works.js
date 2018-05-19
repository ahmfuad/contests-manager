let Controller = require("../controllers/works");

module.exports = function (app) {
    app.get('/works/my', Controller.get_my_works);

    app.get("/works/:workId", Controller.get_work);

    app.post("/works/:workId/delete", Controller.delete_work);

    app.post("/works/:workId/likes/add", Controller.add_like);

    app.post("/works/:workId/likes/delete", Controller.delete_like);
};