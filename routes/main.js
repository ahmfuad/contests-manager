let Contests = require("../models/contest.js");
let Types = require("../models/type");
const limit = 10;

module.exports = function (app) {
    app.get('/', (req, res) =>{
        Contests
            .find()
            .sort({_id: -1})
            .skip(req.param("page"))
            .limit(limit)
            .exec((err, contests)=>{
                res.send(contests);
            })
    });
};