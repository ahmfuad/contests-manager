let mongoose = require('mongoose');
let findOrCreate = require('mongoose-find-or-create');
let autoIncrement = require('mongoose-auto-increment');

let Schema = mongoose.Schema;

const WorkSchema = new mongoose.Schema({
    name: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref:"User", required: true},
    submission_date: {type: Date, required: true, default: Date.now},
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    work_url: {type: String, required:true},
    contest: { type: Number, ref: 'Contest', required: true}
});
WorkSchema.plugin(findOrCreate);
WorkSchema.plugin(autoIncrement.plugin, 'Work');

module.exports = mongoose.model('Work', WorkSchema);
