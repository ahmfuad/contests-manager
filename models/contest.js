let mongoose = require('mongoose');
let findOrCreate = require('mongoose-find-or-create');
let autoIncrement = require('mongoose-auto-increment');

let Schema = mongoose.Schema;

const ContestSchema = new mongoose.Schema({
    admin: { type: Schema.Types.ObjectId, ref: 'User' },
    works: [{ type: Schema.Types.ObjectId, ref: 'Work' }],
    type: { type: Schema.Types.ObjectId, ref: 'ContestType' },
    name: String
});
ContestSchema.plugin(findOrCreate);
ContestSchema.plugin(autoIncrement.plugin, 'Contest');

module.exports = mongoose.model('Contest', ContestSchema);