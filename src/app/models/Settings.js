const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const settingsSchema = new mongoose.Schema({
    userId: { type: ObjectId, ref: 'User' },
    settings: Array
});

module.exports = mongoose.model('Settings', settingsSchema);
