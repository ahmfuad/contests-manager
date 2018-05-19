let mongoose = require('mongoose');
let findOrCreate = require('mongoose-find-or-create');
let autoIncrement = require('mongoose-auto-increment');

let Schema = mongoose.Schema;

const ContestSchema = new mongoose.Schema({
    admin: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    works: [{ type: Number, ref: 'Work' }],
    name: {type: String, required: true},
    description: String,
    contest_image: {type:String, required: true},
    contest_type: String,
    created_date: {type: Date, default: Date.now},
    start_date: {type: Date, required: true},
    finish_date: {type:Date, required: true},
    winner: { type: Schema.Types.ObjectId, ref: 'Work'}
});
ContestSchema.plugin(findOrCreate);
ContestSchema.plugin(autoIncrement.plugin, 'Contest');

module.exports = mongoose.model('Contest', ContestSchema);
