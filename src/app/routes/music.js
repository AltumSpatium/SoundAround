const moment = require('moment');
const fs = require('fs');
const mm = require('music-metadata');

const mongoose = require('mongoose');
const GridFS = require('gridfs-stream');
GridFS.mongo = mongoose.mongo;

const User = require('../models/User');
const Track = require('../models/Track');

const urlExample = '/api/music/list/alex?pageSize=20&page=2&orderBy=date';
const orderBy = ['date', 'name', 'artist'];

const saveAudio = (filePath, user) => {
    return new Promise(async (resolve, reject) => {
        const audioMetadata = await mm.parseFile(filePath);
        const gfs = GridFS(mongoose.connection.db);
    
        const { artist, title, album, picture } = audioMetadata.common;
        const { duration, dataformat, codecProfile } = audioMetadata.format;

        const trackName = `${artist}-${title}`.replace(/ /g, '_');
        const filename = `${user.username}_${trackName}`;
        const gfsWriteStream = gfs.createWriteStream({ filename });
    
        fs.createReadStream(filePath).pipe(gfsWriteStream);
        gfsWriteStream.on('close', async file => {
            const track = new Track({
                trackId: file._id,
                duration,
                dataFormat: dataformat,
                codecProfile,
                title, album, artist, picture,
                lyrics: null
            });
            await track.save();

            user.tracks.push(file._id);
            await user.save();

            fs.unlinkSync(filePath);
            resolve();
        });

        gfsWriteStream.on('error', error => {
            reject(error);
        });
    })
};

const getUserMusic = async (req, res) => {
    const username = req.params.username;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: `No user registered with username ${username}` }); 
    }

    res.end();
};

const uploadUserMusic = async (req, res) => {
    const username = req.params.username;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: `No user registered with username ${username}` }); 
    }

    const filePath = req.file.path;
    saveAudio(filePath, user)
        .catch(error => res.status(500).json({ message: 'Error while saving audio' }))
        .then(() => res.json({ message: 'Saved' }));
};

module.exports = {
    getUserMusic, uploadUserMusic
};
