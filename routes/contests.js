let Contests = require("../models/contest.js");
let Types = require("../models/type");
const limit = 10;

module.exports = function (app) {
    app.get('/', (req, res) =>{
        let page = parseInt(req.query.page) || 0;
        Contests
            .find()
            .sort({_id: -1})
            .skip(page)
            .limit(limit)
            .exec((err, contests)=>{
                res.send(contests);
            })
    });

    app.put("/contest", (req, res)=>{
        let type_id = req.params.type_id; //TODO пофиксить

        let contest = new Contests({admin:req.user._id});
        contest.save((err) => {
            if (err) res.sendStatus(202);
            else res.redirect(`/contest/${contest._id}`);
        })
    });

    app.get("/contest/:contestId", (req, res) => {
        Contests.findOne({_id: req.params.contestId}, (err, contest) =>{
            if (err) res.sendStatus(404);
            else {
                res.send(contest);
            }
        })
    })
};