let Contests = require("../models/contest.js");
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
    app.get("/test", (req, res)=>res.send("test"));
};