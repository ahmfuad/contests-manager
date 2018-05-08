let mongoose = require('mongoose');
let findOrCreate = require('mongoose-find-or-create');
let autoIncrement = require('mongoose-auto-increment');

let Schema = mongoose.Schema;

const WorkSchema = new mongoose.Schema({
    author: {type: Schema.Types.ObjectId, ref:"User", required: true},
    submission_date: {type: Date, required: true},
    contest: { type: Number, ref: 'Contest', required: true},
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    name: {type: String, required: true}
});
WorkSchema.plugin(findOrCreate);
WorkSchema.plugin(autoIncrement.plugin, 'Work');

module.exports = mongoose.model('Work', WorkSchema);
