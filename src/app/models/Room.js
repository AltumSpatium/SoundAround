const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const roomSchema = new mongoose.Schema({
    authorId: { type: ObjectId, ref: 'User' },
    name: String,
    description: String,
    public: Boolean,
    password: String,
    currentPlaylist: { type: String, ref: 'Playlist' },
    nowPlaying: { type: String, ref: 'Track' },
    usersOnline: [{ type: String, ref: 'User' }],
    messages: [{ user: { type: String, ref: 'User' }, text: String, date: Date }]
});

module.exports = mongoose.model('Room', roomSchema);
