let mongoose = require('mongoose');
let findOrCreate = require('mongoose-find-or-create');

let Schema = mongoose.Schema;

const ContestSchema = new mongoose.Schema({
    admin: { type: Schema.Types.ObjectId, ref: 'User' },
    works: [{ type: Schema.Types.ObjectId, ref: 'Work' }],
    type: { type: Schema.Types.ObjectId, ref: 'ContestType' },
    name: String,
    start_date: Date,
    finish_date: Date
    //TODO winner field?
});
ContestSchema.plugin(findOrCreate);

module.exports = mongoose.model('Contest', ContestSchema);
