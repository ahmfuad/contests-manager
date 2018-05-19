let Agenda = require("agenda");
let Contests = new require("../models/contest.js");

module.exports = function (app) {
    let agenda = new Agenda({db: {address: global.__databaseUri}});
    agenda.define('finish contests', function (job, done) {
        Contests
            .find({
                finish_date: {$lt: Date.now()},
                winner:  null
            })
            .populate("works")
            .exec()
            .then((contests)=>{
                contests.forEach((contest) => {
                    contest.winner = (contest.works.sort((work1, work2) => work2.likes.length - work1.likes.length))[0]._id;
                    contest.save();
                });
                done();
            });
    });

    agenda.on('ready', function () {
        agenda.every('30 minutes', 'finish contests');
        agenda.start();
    });
};