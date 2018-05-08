let mongoose = require('mongoose');
let findOrCreate = require('mongoose-find-or-create');

const UserSchema = new mongoose.Schema({
    vkID: {type: String, required: true},
    name: String,
    avatar_url: String,
    profile_url: String
});
UserSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', UserSchema);
