let mongoose = require('mongoose');
let findOrCreate = require('mongoose-find-or-create');

const ContestTypeSchema = new mongoose.Schema({
    name: String
});
ContestTypeSchema.plugin(findOrCreate);

module.exports = mongoose.model('ContestType', ContestTypeSchema);
