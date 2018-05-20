let Works = new require("../models/work.js");
//TODO concurrency
//region Exports
exports.get_my_works = (req, res) => {
    if (!req.user) res.sendStatus(401);
    else{
        Works
            .find({author: req.user._id})
            .exec()
            .then(contests=>{
                res.send(contests);
            })
            .catch(err=>{
                res.sendStatus(500);
            })
    }
};

exports.get_work = (req, res) => {
    Works
        .findById(req.params["workId"])
        .exec()
        .then(work => {
            if (work === null) res.sendStatus(404);
            else {
                res.send(work);
            }
        })
        .catch(err=>{
            res.sendStatus(500);
        })
};

exports.delete_work = (req, res) => {
    if (!req.user) res.sendStatus(401);
    else{
        Works
            .findById(req.params["workId"])
            .populate('contest')
            .exec()
            .then(work=>{
                if (work === null) res.sendStatus(404);
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
            .catch(err=>{
                res.sendStatus(500);
            })
    }
};

exports.add_like = (req, res) => {
    if (!req.user) res.sendStatus(401);
    else{
        Works
            .findById(req.params["workId"])
            .populate('contest')
            .exec()
            .then(work=>{
                if (work === null) res.sendStatus(404);
                else{
                    if (!(req.user._id in work.likes) && work.contest.finish_date > Date.now() && work.author !== req.user._id){
                        Works
                            .update(
                                {_id: req.params["workId"]},
                                {$addToSet: {likes: req.user._id}},
                                (err, raw) => {
                                    if (err) throw "db err";
                                    else res.sendStatus(200);
                                }
                            );
                    }
                    else{
                        res.sendStatus(400);
                    }
                }
            })
            .catch(err=>{
                res.sendStatus(500);
            })
    }
};

exports.delete_like = (req, res) => {
    if (!req.user) res.sendStatus(401);
    else{
        Works
            .findById(req.params["workId"])
            .populate('contest')
            .exec()
            .then(work=>{
                if (work === null) res.sendStatus(404);
                else{
                    if ((req.user._id in work.likes) && work.contest.finish_date > Date.now()){
                        Works
                            .update(
                                {_id: req.params["workId"]},
                                {$pull: {likes: req.user._id}},
                                (err, raw) => {
                                    if (err) throw "db err";
                                    else res.sendStatus(200);
                                }
                            );
                    }
                    else{
                        res.sendStatus(400);
                    }
                }
            })
            .catch(err=>{
                res.sendStatus(500);
            })
    }
};
//endregion