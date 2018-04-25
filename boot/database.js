let Type = require("../models/type.js");

module.exports = function (app) {
    Type.findOrCreate({ name: "Текстовый конкурс" }, (err, result)=>{

    });
    Type.findOrCreate({ name: "Конкурс изображений" }, (err, result)=>{

    });
};