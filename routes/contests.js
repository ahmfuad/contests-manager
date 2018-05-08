let Contests = new require("../models/contest.js");
const limit = 10;

module.exports = function (app) {
    app.get('/contests', (req, res) =>{
        let page = parseInt(req.query.page) || 0;
        Contests
            .find()
            .select({works: 0, admin: 0})
            .sort({created_date: -1})
            .skip(page*limit)
            .limit(limit)
            .exec((err, contests)=>{
                res.send(contests);
            })
    });

    app.get('/contests/my', (req, res)=>{
        if (!req.user) res.sendStatus(401);
        else{
            Contests
                .find({admin: req.user._id})
                .exec((err, contests)=>{
                    if (err) res.sendStatus(500);
                    else res.send(contests);
                })
        }
    });

    app.get("/contests/:contestId", (req, res) => {
        Contests
            .findOne({_id: req.params["contestId"]})
            .populate("works")
            .exec((err, contest) =>{
                if (err) res.sendStatus(500);
                if (contest === null) res.sendStatus(404);
                else {
                    if (contest.finish_date < Date.now() && contest.winner === null){
                        contest.winner = (contest.works.sort((work1, work2) => work2.likes.length - work1.likes.length))[0]._id;
                        contest.save((err) =>{
                            if (err) res.sendStatus(500);
                        });
                    }
                    res.send(contest);
                }
        })
    })

    app.post("/contests", (req, res)=>{
        if (!req.user) res.sendStatus(401);
        else {
            let admin = req.user._id;
            let name = req.body["name"];
            let description = req.body["description"];
            let created_date = Date.now();
            let start_date = req.body["start_date"] || Date.now();
            let finish_date = req.body["finish_date"];

            if (!finish_date || !name) res.sendStatus(400);
            else {
                let contest = new Contests({
                    admin: admin,
                    name: name,
                    created_date: created_date,
                    start_date: start_date,
                    finish_date: finish_date,
                    description: description
                });
                contest.save((err) => {
                    if (err) res.sendStatus(500);
                    else res.redirect(`/contest/${contest._id}`);
                })
            }
        }
    });

};