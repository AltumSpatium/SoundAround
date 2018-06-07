const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const playlistSchema = new mongoose.Schema({
    authorId: { type: ObjectId, ref: 'User' },
    authorUsername: String,
    tracks: [{ type: String, ref: 'Track' }],
    title: String,
    playlistPicture: {
        format: String,
        data: Buffer
    },
    lastUpdatedDate: Date,
    createdDate: Date,
    usersLinks: Number
});

module.exports = mongoose.model('Playlist', playlistSchema);
