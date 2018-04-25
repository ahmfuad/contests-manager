let mongoose = require('mongoose');
let findOrCreate = require('mongoose-find-or-create');

let Schema = mongoose.Schema;

const WorkSchema = new mongoose.Schema({
    contest: { type: Number, ref: 'Contest' },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    name: String
});
WorkSchema.plugin(findOrCreate);

module.exports = mongoose.model('Work', WorkSchema);
