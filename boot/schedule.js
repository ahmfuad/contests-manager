let Agenda = require("agenda");
let Contests = new require("../models/contest.js");

module.exports = function (app) {
    let agenda = new Agenda({db: {address: global.__databaseUri}});
    agenda.define('finish contests', function (job, done) {
        //TODO планировщик
        done();
    });

    agenda.on('ready', function () {
        agenda.every('30 minutes', 'finish contests');
        agenda.start();
    });
}