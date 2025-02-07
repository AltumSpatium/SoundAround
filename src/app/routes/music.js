const moment = require('moment');
const shuffle = require('../util/shuffle');
const fs = require('fs');
const path = require('path');
const mm = require('music-metadata');

const mongoose = require('mongoose');
const GridFS = require('gridfs-stream');
GridFS.mongo = mongoose.mongo;

const User = require('../models/User');
const Track = require('../models/Track');

const orderByTypes = ['uploadDate', 'title', 'artist', 'random'];

const saveAudio = (filePath, user) => {
    return new Promise(async (resolve, reject) => {
        const audioMetadata = await mm.parseFile(filePath);
        const gfs = GridFS(mongoose.connection.db);
    
        const { artist, title, album, picture } = audioMetadata.common;
        const { duration, dataformat, codecProfile } = audioMetadata.format;
        const albumCover = picture ? picture[0] : null;

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
                title, album, artist,
                picture: albumCover,
                lyrics: null,
                uploadDate: new Date(),
                usersLinks: 1
            });
            track.save();

            user.tracks.push(track._id);
            User.findOneAndUpdate({ username: user.username }, { tracks: user.tracks }, {}).exec();

            fs.unlinkSync(filePath);
            resolve(track);
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

    const tracks = Track.find({ '_id': { $in: user.tracks } });

    if (!req.query.page && !req.query.page && !req.query.orderBy && !req.query.orderType) {
        return res.send(await tracks.sort('-uploadDate'));
    } else {
        const getSortParam = (orderBy, orderType) => {
            let sortParam = orderByTypes.includes(orderBy) ? orderBy : 'uploadDate';
            if (sortParam === 'random') sortParam = 'uploadDate';
            return `${orderType === 'desc' ? '-' : ''}${sortParam}`;
        };

        const { pageSize=10, page=1, orderBy, orderType } = req.query;
        const tracksPage = await tracks.sort(getSortParam(orderBy, orderType))
            .skip(pageSize * (page - 1)).limit(+pageSize);
        
        if (orderBy === 'random') shuffle(tracksPage);

        return res.send(tracksPage);
    }
};

const getTrack = async (req, res) => {
    const { trackId } = req.params;
    const track = await Track.findById(trackId);
    if (!track) {
        return res.status(404).json({ message: `No track found with id ${trackId}` });
    }

    const { onlyInfo } = req.query;
    if (onlyInfo == 1) {
        return res.send({ track });
    } else {
        const gfs = new GridFS(mongoose.connection.db);
        const gfsReadStream = gfs.createReadStream({ _id: track.trackId });

        const trackName = `${track._id}.${track.dataFormat}`;
        const writeFilename = path.join(__dirname, `../../../build/audio/${trackName}`);
        if (!fs.existsSync(writeFilename)) {
            const fsWriteStream = fs.createWriteStream(writeFilename);
            gfsReadStream.pipe(fsWriteStream);
            fsWriteStream.on('close', () => {
                res.send({ track, trackFilename: `/audio/${trackName}` });
            });
        } else res.send({ track, trackFilename: `/audio/${trackName}` });
    }
};

const addTrack = async (username, trackId) => {
    const user = await User.findOne({ username });
    user.tracks.push(trackId);
    User.findOneAndUpdate({ username }, { tracks: user.tracks }, {}).exec();
    Track.findByIdAndUpdate(trackId, { $inc: { usersLinks: 1 } }, {}).exec();
};

const updateTrack = async (req, res) => {
    const { username, trackId } = req.params;
    const { artist, title, lyrics, album } = req.body;

    const user = await User.findOne({ username });
    const track = await Track.findById(trackId);

    if (track.artist === artist && track.title === title &&
        track.lyrics === lyrics && track.album === album) {
        return res.json({ message: 'Nothing to update' });
    }

    const updatedTrack = new Track({
        trackId: track.trackId,
        duration: track.duration,
        dataFormat: track.dataFormat,
        codecProfile: track.codecProfile,
        picture: track.picture,
        uploadDate: track.uploadDate,
        usersLinks: 1,
        artist, title, lyrics, album
    });

    updatedTrack.save();

    if (track.usersLinks === 1) {
        Track.remove({ _id: track._id }).exec();
    } else {
        Track.findByIdAndUpdate(track._id, { $inc: { usersLinks: -1 } }).exec();
    }

    user.tracks.splice(user.tracks.indexOf(track._id), 1, updatedTrack._id);
    User.findOneAndUpdate({ username: user.username }, { tracks: user.tracks }, {}).exec();
    res.json({ message: 'Successfully updated', updatedTrack });
}

const deleteTrack = async (req, res) => {
    const { username, trackId } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: `No user registered with username ${username}` }); 
    }

    const track = await Track.findById(trackId);
    if (!track) {
        return res.status(404).json({ message: `No track found with id ${trackId}` });
    }

    const trackIndex = user.tracks.indexOf(trackId);
    if (trackIndex !== -1) {
        user.tracks.splice(trackIndex, 1);
        User.findOneAndUpdate({ username }, { tracks: user.tracks }, {}, err => {
            if (err) res.status(500).json({ message: 'Error while deleting track' });
        });
    } else return;

    if (track.usersLinks === 1) {
        const gfs = new GridFS(mongoose.connection.db);
        gfs.remove({ _id: track.trackId }, err => {
            if (err) res.status(500).json({ message: 'Error while deleting track' });
            else {
                Track.findByIdAndRemove(trackId, err => {
                    if (err) res.status(500).json({ message: 'Error while deleting track' });
                    else res.json({ message: 'Successfully deleted', trackId  });
                });
            }
        })
    } else {
        Track.findByIdAndUpdate(trackId, { $inc: { usersLinks: -1 } }, {}, err => {
            if (err) {
                res.status(500).json({ message: `Error while deleting track` });
            } else {
                res.json({ message: 'Successfully deleted', trackId });
            }
        });
    }
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
        .then(newTrack => res.json({ message: 'Saved', trackId: newTrack._id }));
};

module.exports = {
    getUserMusic, getTrack, uploadUserMusic,
    addTrack, updateTrack, deleteTrack
};
