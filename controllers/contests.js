let nconf = require("nconf");
let guid = require("guid");
let path = require("path");
let mime = require("mime-types");

let Contests = new require("../models/contest.js");
let Works = new require("../models/work.js");
//TODO concurrency
//region Functions
const limit = 10;

function contest_image_check(contest_image){
    return (!contest_image || ["image/jpeg", "image/png"].indexOf(contest_image.mimetype) === -1 || contest_image.data.length>1024*1024*5);
}
//endregion

//region Exports
exports.get_all_contests = (req,res) => {
    let page = parseInt(req.query.page) || 0;
    Contests
        .find()
        .select({works: 0, admin: 0})
        .sort({created_date: -1})
        .skip(page*limit)
        .limit(limit)
        .exec()
        .then(contests=>{
            res.send(contests);
        })
        .catch(err=>{
            res.sendStatus(500)
        });
};
//TODO поиск по имени и статусу завершенности

exports.add_contest = (req, res) => {
    if (!req.user) res.sendStatus(401);
    else {
        let contest_image = req.files["contest_image"];
        if (!contest_image_check(contest_image)) res.sendStatus(400);
        else{
            let imgID = guid.raw();
            let imgExt = mime.extension(contest_image.mimetype);
            let mvUrl = path.join("previews", `${imgID}.${imgExt}`);
            contest_image.mv(path.join(__basedir, "public", mvUrl), function(err) {
                if (err) res.sendStatus(500);
                else{
                    let admin = req.user._id;
                    let name = req.body["name"];
                    let description = req.body["description"];
                    let created_date = Date.now();
                    let start_date = req.body["start_date"] || Date.now();
                    let finish_date = req.body["finish_date"];
                    let contest_type = req.body["contest_type"];
                    let contest_image = `/previews/${imgID}.${imgExt}`;

                    if (!finish_date || !name || !(contest_type in nconf.get("types"))) res.sendStatus(400);
                    else {
                        let contest = new Contests({
                            admin: admin,
                            name: name,
                            description: description,
                            contest_type: contest_type,
                            created_date: created_date,
                            start_date: start_date,
                            finish_date: finish_date,
                            contest_image: contest_image
                        });
                        contest.save((err, contest)=>{
                            if (err) res.sendStatus(500);
                            else res.redirect(`/contest/${contest._id}`);
                        });
                    }
                }
            });
        }
    }
};

exports.get_my_contests = (req, res) => {
    if (!req.user) res.sendStatus(401);
    else{
        Contests
            .find({admin: req.user._id})
            .exec()
            .then(contests=>{
                res.send(contests)
            })
            .catch(err=>{
                res.sendStatus(500);
            });
    }
};

exports.get_contest_by_id = (req, res) => {
    Contests
        .findOne({_id: req.params["contestId"]})
        .populate("works")
        .exec()
        .then(contest => {
            if (contest === null) res.sendStatus(404);
            else {
                if (contest.finish_date < Date.now() && contest.winner === null){
                    contest.winner = (contest.works.sort((work1, work2) => work2.likes.length - work1.likes.length))[0]._id;
                    contest.save((err) =>{
                        if (err) throw "save error";
                        else sendContest(res, contest);
                    });
                }
                else{
                    sendContest(res, contest);
                }
            }
        })
        .catch(err=>{
            res.sendStatus(500);
        });
    function sendContest(res, contest){
        if (req.user) {
            contest.works = contest.works.map((work) => {
                work["liked"] = work.likes.indexOf(req.user._id) > -1;
                return work;
            });
        }
        res.send(contest);
    }
};

exports.edit_contest = (req, res) => {
    if (!req.user) res.sendStatus(401);
    else {
        Contests
            .findOne({_id: req.params["contestId"]})
            .exec()
            .then(contest => {
                if (contest === null) res.sendStatus(404);
                else {
                    if (contest.admin === req.user._id) {
                        let toChange = req.body;
                        if (toChange["name"]) contest.name = toChange["name"];
                        if (toChange["description"]) contest.description = toChange["description"];
                        if (toChange["start_date"] && toChange["start_date"] > contest.start_date) contest.start_date = toChange["start_date"];
                        if (toChange["finish_date"] && toChange["finish_date"] > contest.finish_date) contest.finish_date = toChange["finish_date"];
                        if (toChange["close"]) contest.finish_date = Date.now();
                        contest.save(err => {
                            if (err) throw 'save error';
                            else res.redirect(`/contest/${contest._id}`);
                        });
                    }
                    else {
                        res.sendStatus(403);
                    }
                }
            })
            .catch(err => {
                res.sendStatus(500);
            })
    }
};

exports.set_pic = (req, res) => {
    if (!req.user) res.sendStatus(401);
    else {
        Contests
            .findOne({_id: req.params["contestId"]})
            .exec()
            .then(contest => {
                if (contest === null) res.sendStatus(404);
                else {
                    if (contest.admin === req.user._id) {
                        let contest_image = req.files["contest_image"];
                        if (!contest_image_check(contest_image)) res.sendStatus(400);
                        else {
                            let imgID = guid.raw();
                            let imgExt = mime.extension(contest_image.mimetype);
                            let mvUrl = path.join("previews", `${imgID}.${imgExt}`);
                            contest_image.mv(path.join(__basedir, "public", mvUrl), function (err) {
                                if (err) throw 'save error';
                                else {
                                    contest.contest_image = `/previews/${imgID}.${imgExt}`;
                                    contest.save(err => {
                                        if (err) throw 'save error';
                                        else res.redirect(`/contest/${contest._id}`);
                                    });
                                }
                            })
                        }
                    }
                    else {
                        res.sendStatus(403);
                    }
                }
            })
            .catch(err => {
                res.sendStatus(500);
            });
    }
};

exports.add_work = (req,res) => {
    if (!req.user) res.sendStatus(401);
    else if (!res.files["work"]) res.sendStatus(400);
    else {
        Contests
            .findOne({_id: req.params["contestId"]})
            .populate("works")
            .exec()
            .then(contest => {
                if (contest === null) res.sendStatus(404);
                else {
                    if (contest.admin !== req.user._id && (contest.start_date < Date.now() && contest.finish_date > Date.now())) {
                        let authors = contest.works.map(work => work.author);
                        if (authors.indexOf(req.user._id) > -1) res.sendStatus(403);
                        else {
                            let contest_type = contest.contest_type;
                            let work_data = req.files["work"];
                            let config_types = nconf.get("types");
                            if (!(contest_type in config_types)) throw "wtf";
                            else {
                                let allowed_mimes = config_types[contest_type]["mimes"];
                                if (allowed_mimes.indexOf(work_data.mimetype) === -1) res.sendStatus(403);
                                else{
                                    let workID = guid.raw();
                                    let workExt = mime.extension(contest_image.mimetype);
                                    let mvUrl = path.join("works", contest_type, req.params["contestId"], `${workID}.${workExt}`);
                                    work_data.mv(path.join(__basedir, "public", mvUrl), function (err) {
                                        if (err) throw 'save error';
                                        else {
                                            let work = new Works({
                                                name: req.body["name"] || "NoName",
                                                author: req.user._id,
                                                submission_date: Date.now(),
                                                likes:[],
                                                contest: req.params["contestId"],
                                                work_url: `/works/${contest_type}/${workID}.${workExt}`
                                            });
                                            work.save((err, work)=>{
                                                if (err) throw "save err";
                                                Contests
                                                    .findOneAndUpdate({_id: contest._id}, {$push: {works: work._id}})
                                                    .exec()
                                                    .then((contest)=>{res.redirect(`/contest/${contest._id}`);})
                                                    .catch(()=>{res.sendStatus(500)});
                                            })
                                        }
                                    })
                                }
                            }
                        }
                    }
                    else {
                        res.sendStatus(403);
                    }
                }
            })
            .catch(err => {
                res.sendStatus(500);
            });
    }
};
//endregion
