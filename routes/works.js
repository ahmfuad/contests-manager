let Contests = new require("../models/contest.js");
let Works = new require("../models/work.js");

module.exports = function (app) {
    app.get('/works/my', (req, res)=>{
        if (!req.user) res.sendStatus(401);
        else{
            Works
                .find({author: req.user._id})
                .exec((err, contests)=>{
                    if (err) res.sendStatus(500);
                    else res.send(contests);
                })
        }
    });

    app.get("/works/:workId", (req, res) => {
        Works
            .findOne({_id: req.params["workId"]})
            .exec((err, work) => {
                if (err) res.sendStatus(500);
                if (work === null) res.sendStatus(404);
                else {
                    res.send(work);
                }
            })
    });

    app.delete("/works/:workId/", (req, res)=>{
        if (!req.user) res.sendStatus(401);
        else{
            Works
                .findById(req.params["workId"])
                .populate('contest')
                .exec((err, work)=>{
                    if (err) res.sendStatus(500);
                    else if (work === null) res.sendStatus(404);
                    else{
                        if (req.user._id ===  work.author || req.user._id === work.contest.admin){
                            work.contest.works = work.contest.works.filter(workId => workId !== work._id);
                            work.save((err)=>{
                               if (err) res.sendStatus(500);
                               else work.remove((err, work)=>{
                                   if (err) res.sendStatus(500);
                                   else res.sendStatus(200);
                               })
                            });
                        }
                        else{
                            res.sendStatus(400);
                        }
                    }
                })
        }
    });

    app.post("/works/:workId/likes", (req, res)=>{
        if (!req.user) res.sendStatus(401);
        else{
            Works
                .findById(req.params["workId"])
                .populate('contest')
                .exec((err, work)=>{
                    if (err) res.sendStatus(500);
                    else if (work === null) res.sendStatus(404);
                    else{
                        if (!(req.user._id in work.likes) && work.contest.finish_date > Date.now()){
                            work.likes.push(req.user._id);
                            work.save((err)=>{
                               if (err) res.sendStatus(500);
                               else res.sendStatus(200);
                            });
                        }
                        else{
                            res.sendStatus(400);
                        }
                    }
                })
        }
    });

    app.delete("/works/:workId/likes", (req, res)=>{
        if (!req.user) res.sendStatus(401);
        else{
            Works
                .findById(req.params["workId"])
                .populate('contest')
                .exec((err, work)=>{
                    if (err) res.sendStatus(500);
                    else if (work === null) res.sendStatus(404);
                    else{
                        if ((req.user._id in work.likes) && work.contest.finish_date > Date.now()){
                            work.likes = work.likes.filter(userId => userId !== req.user._id);
                            work.save((err)=>{
                                if (err) res.sendStatus(500);
                                else res.sendStatus(200);
                            });
                        }
                        else{
                            res.sendStatus(400);
                        }
                    }
                })
        }
    });
};