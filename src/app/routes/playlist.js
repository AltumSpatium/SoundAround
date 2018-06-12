const moment = require('moment');
const shuffle = require('../util/shuffle');
const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose');

const User = require('../models/User');
const Track = require('../models/Track');
const Playlist = require('../models/Playlist');

const { decodeToken } = require('./auth');

const orderByTypes = ['createdDate', 'lastUpdatedDate', 'tracksCount', 'duration', 'title', 'random'];

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
    const sortPlaylist = (tracksPage, playlistTracks) => {
        return tracksPage.sort((a, b) => {
            return playlistTracks.indexOf(a._id) - playlistTracks.indexOf(b._id);
        });
    };

    if (!req.query.pageSize && !req.query.page) {
        const pTracks = await playlistTracks;
        return res.send(sortPlaylist(pTracks, playlist.tracks));
    } else {
        const { pageSize=10, page=1 } = req.query;
        const playlistTracksPage = await playlistTracks.skip(pageSize * (page - 1)).limit(+pageSize);
        return res.send(sortPlaylist(playlistTracksPage, playlist.tracks));
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

const getPlaylists = async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: `No user registered with username ${username}` });
    }

    const playlists = Playlist.find({ _id: { $in: user.playlists } });
    if (!req.query.page && !req.query.pageSize && !req.query.orderBy &&
        !req.query.orderType) {
        return res.send(await playlists.sort('-createdDate'))
    } else {
        const getSortParam = (orderBy, orderType) => {
            let sortParam = orderByTypes.includes(orderBy) ? orderBy : 'createdDate';
            if (sortParam === 'random') sortParam = 'createdDate';
            return `${orderType === 'desc' ? '-' : ''}${sortParam}`;
        };

        const { page=1, pageSize=10, orderBy, orderType } = req.query;
        if (orderBy === 'tracksCount') {
            const allPlaylists = await playlists;
            allPlaylists.sort((a, b) => b.tracks.length - a.tracks.length);
            const skipIndex = pageSize * (page - 1);
            const playlistsPage = allPlaylists.slice(skipIndex, skipIndex + pageSize);
            return res.send(playlistsPage);
        } else if (orderBy === 'duration') {
            const allPlaylists = await playlists;
            const calcDuration = arr => arr.reduce((p, c) => p + c.duration, 0);
            const playlistDuration = {};
            for (let playlist of allPlaylists) {
                playlistDuration[playlist._id] = calcDuration(await Track.find({ _id: { $in: playlist.tracks } }));
            }
            allPlaylists.sort((a, b) => {
                let durationA = playlistDuration[a._id];
                let durationB = playlistDuration[b._id];
                return durationB - durationA;
            });
            const skipIndex = pageSize * (page - 1);
            const playlistsPage = allPlaylists.slice(skipIndex, skipIndex + pageSize);
            return res.send(playlistsPage);
        } else {
            const playlistsPage = await playlists.sort(getSortParam(orderBy, orderType))
                .skip(pageSize * (page - 1)).limit(+pageSize);
            if (orderBy === 'random') shuffle(playlistsPage);
            return res.send(playlistsPage);
        }
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
            data: playlistPicture && playlistPicture.data ? new Buffer(playlistPicture.data) : null
        },
        lastUpdatedDate: new Date()
    }).exec();

    return res.json({ message: 'Successfully updated' });
}

const deletePlaylist = async (req, res) => {
    const { username, playlistId } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: `No user registered with username ${username}` }); 
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        return res.status(404).json({ message: `No playlist found with id ${playlistId}` });
    }

    const playlistIndex = user.playlists.indexOf(playlistId);
    if (playlistIndex !== -1) {
        user.playlists.splice(playlistIndex, 1);
        User.findOneAndUpdate({ username }, { playlists: user.playlists }, {}, err => {
            if (err) res.status(500).json({ message: 'Error while deleting playlist' });
        });
    } else return;

    if (playlist.usersLinks === 1) {
        Playlist.findByIdAndRemove(playlistId, err => {
            if (err) res.status(500).json({ message: 'Error while deleting playlist' });
            else res.json({ message: 'Successfully deleted', playlistId  });
        });
    } else {
        Playlist.findByIdAndUpdate(playlistId, { $inc: { usersLinks: -1 } }, {}, err => {
            if (err) {
                res.status(500).json({ message: `Error while deleting playlist` });
            } else {
                res.json({ message: 'Successfully deleted', playlistId });
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
            res.json({ message: 'Successfully saved', playlistId: newPlaylist._id });
        }
    });
};

module.exports = {
    getUserPlaylist, addPlaylist, updatePlaylist,
    deletePlaylist, createPlaylist, getPlaylistTracks,
    getPlaylists
};
