const moment = require('moment');
const shuffle = require('../util/shuffle');
const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose');

const User = require('../models/User');
const Track = require('../models/Track');
const Playlist = require('../models/Playlist');

const { decodeToken } = require('./auth');

const urlExample = '/api/playlists/list/alex/123?pageSize=20&page=2';
const orderByTypes = ['uploadDate', 'title', 'tracksCount', 'duration', 'random'];

const getPlaylistTracks = async (req, res) => {
    const { username, playlistId } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: `No user registered with username ${username}` });
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        return res.status(404).json({ message: `No playlist found with id ${playlistId}` });
    }

    if (!user.playlists.includes(playlistId)) {
        return res.status(403).json({ message: `Access denied to this playlist` });
    }

    const playlistTracks = Track.find({ _id: { $in: playlist.tracks } });

    if (!req.query.pageSize && !req.query.page) {
        return res.send(await playlistTracks);
    } else {
        const { pageSize=10, page=1 } = req.query;
        const playlistTracksPage = await playlistTracks.skip(pageSize * (page - 1)).limit(+pageSize);
        return res.send(playlistTracksPage);
    }
};

const getUserPlaylist = async (req, res) => {
    const { playlistId } = req.params;
    if (!playlistId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(403).json({ message: `Invalid playlist id` });
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        return res.status(404).json({ message: `No playlist found with id ${playlistId}` });
    }

    return res.send(playlist);
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
    const { playlistId } = req.params;
    if (!playlistId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(403).json({ message: `Invalid playlist id` });
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        return res.status(404).json({ message: `No playlist found with id ${playlistId}` });
    }

    const token = req.headers['x-access-token'];
    const payload = decodeToken(token);
    const user = await User.findOne({ username: payload.sub });
    if (!user) {
        return res.status(404).json({ message: `No user registered with username ${username}` });
    }

    if (user._id != playlist.authorId.toString()) {
        return res.status(403).json({ message: `Not authorized for this action` });
    }

    const { title, tracks, playlistPicture } = req.body;
    Playlist.findByIdAndUpdate(playlistId, {
        title, tracks,
        playlistPicture: {
            format: 'jpg',
            data: playlistPicture ? new Buffer(playlistPicture.data) : null
        }
    }).exec();

    return res.json({ message: 'Successfully updated' });
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
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: `No user registered with username ${username}` }); 
    }

    const { title, tracks, playlistPicture } = req.body;

    const newPlaylist = new Playlist({
        authorId: user._id,
        authorUsername: username,
        title,
        tracks,
        playlistPicture: {
            format: 'jpg',
            data: playlistPicture ? new Buffer(playlistPicture.data) : null
        },
        lastUpdatedDate: new Date(),
        createdDate: new Date(),
        usersLinks: 1
    });

    user.playlists.push(newPlaylist._id);
    User.findOneAndUpdate({ username }, { playlists: user.playlists }, {}).exec();
    newPlaylist.save((err, savedPlaylist) => {
        if (err) {
            res.status(500).json({ message: `Error while saving playlist` });
        } else {
            res.json({ message: 'Successfully saved' });
        }
    });
};

module.exports = {
    getUserPlaylist, addPlaylist, updatePlaylist,
    deletePlaylist, createPlaylist, getPlaylistTracks
};
