const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, lowercase: true },
    password: String,
    username: { type: String, unique: true },
    tracks: [String],
    playlists: [String],
    rooms: [String],
    currentRoom: String
});

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
});

userSchema.methods.comparePassword = function(password, done) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        done(err, isMatch);
    });
};

module.exports = mongoose.model('User', userSchema);
