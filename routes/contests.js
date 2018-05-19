let Controller = require("../controllers/contests");

module.exports = function (app) {
    app.get('/contests', Controller.get_all_contests);

    app.post("/contests", Controller.add_contest);

    app.get('/contests/my', Controller.get_my_contests);

    app.get("/contests/:contestId", Controller.get_contest_by_id);

    app.post("/contests/:contestId/edit", Controller.edit_contest);

    app.post("/contests/:contestId/new_pic", Controller.set_pic);

    app.post("/contests/:contestId/works", Controller.add_work);
};