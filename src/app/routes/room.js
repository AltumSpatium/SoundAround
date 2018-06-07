const moment = require('moment');
const shuffle = require('../util/shuffle');
const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose');

const User = require('../models/User');
const Track = require('../models/Track');
const Playlist = require('../models/Playlist');

const urlExample = '/api/playlists/list/alex/123?pageSize=20&page=2';
const orderByTypes = ['uploadDate', 'title', 'tracksCount', 'duration', 'random'];

const getUserPlaylist = async (req, res) => {
    const { username, playlistId } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: `No user registered with username ${username}` });
    }

    const playlist = Playlist.findById(playlistId);
    if (!playlist) {
        return res.status(404).json({ message: `No playlist found with id ${playlistId}` });
    }

    if (!user.playlists.includes(playlist._id)) {
        return res.status(403).json({ message: `Access denied to this playlist` });
    }

    const playlistTracks = Track.find({ _id: { $in: playlist.tracks } });

    if (!req.query.pageSize && !req.query.page) {
        return res.send(playlistTracks);
    } else {
        const { pageSize=10, page=1 } = req.query;
        const playlistTracksPage = playlistTracks.skip(pageSize * (page - 1)).limit(+pageSize);
        return res.send(playlistTracksPage);
    }
};

const addPlaylist = async (req, res) => {
    const { username, trackId } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: `No user registered with username ${username}` }); 
    }

    user.tracks.push(trackId);
    User.findOneAndUpdate({ username }, { tracks: user.tracks }, {}).exec();
    Track.findByIdAndUpdate(trackId, { $inc: { usersLinks: 1 } }, {}, err => {
        if (err) {
            res.status(500).json({ message: `Error while adding track` });
        } else {
            res.json({ message: 'Successfully added' });
        }
    });
};

const updatePlaylist = async (req, res) => {
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

const deletePlaylist = async (req, res) => {
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

const createPlaylist = async (req, res) => {
    const username = req.params.username;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: `No user registered with username ${username}` }); 
    }

    const filePath = req.file.path;
    saveAudio(filePath, user)
        .catch(error => res.status(500).json({ message: 'Error while saving audio' }))
        .then(newTrack => res.json({ message: 'Saved', newTrack }));
};

module.exports = {
    getUserPlaylist, addPlaylist, updatePlaylist,
    deletePlaylist, createPlaylist
};
