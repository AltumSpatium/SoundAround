const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const trackSchema = new mongoose.Schema({
    trackId: ObjectId,
    duration: Number,
    dataFormat: String,
    codecProfile: String,
    title: String,
    album: String,
    artist: String,
    picture: {
        format: String,
        data: Buffer
    },
    lyrics: String
});

module.exports = mongoose.model('Track', trackSchema);
