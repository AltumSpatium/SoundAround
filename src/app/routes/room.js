const moment = require('moment');
const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose');

const User = require('../models/User');
const Track = require('../models/Track');
const Playlist = require('../models/Playlist');
const Room = require('../models/Room');

const { decodeToken } = require('./auth');

const orderByTypes = ['uploadDate', 'title', 'tracksCount', 'duration', 'random'];

const getRoomsPage = async (req, res) => {
    const search = req.query.search;
    let rooms;

    if (search) {
        rooms = Room.find({ name: { $regex: search, $options: 'i' } }).select('-messages');
    } else {
        rooms = Room.find({}).select('-messages');
    }

    const sortRooms = rooms => {
        return rooms.slice().sort((a, b) => {
            return b.usersOnline.length - a.usersOnline.length;
        });
    };

    const allRooms = sortRooms(await rooms);

    if (!req.query.page && !req.query.pageSize) {
        return res.send(allRooms);
    } else {
        const { pageSize, page } = req.query;
        const skipIndex = pageSize * (page - 1);
        const roomsPage = allRooms.slice(skipIndex, skipIndex + pageSize);
        return res.send(roomsPage);
    }
};

const createRoom = async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: `No user registered with username ${username}` });
    }

    const { name, description, public, password, currentPlaylist, nowPlaying } = req.body;

    const room = await Room.findOne({ name });
    if (room) {
        return res.status(403).json({ message: `Name '${name}' is already taken ` });
    }

    const newRoom = new Room({
        name, description, public, password, currentPlaylist,
        authorId: user._id,
        nowPlaying: nowPlaying ? nowPlaying : null,
        usersOnline: [],
        messages: []
    });

    user.rooms.push(newRoom._id);
    User.findOneAndUpdate({ username }, { rooms: user.rooms }, {}).exec();
    newRoom.save((err, savedRoom) => {
        if (err) {
            res.status(500).json({ message: `Error while creating room` });
        } else {
            res.json({ message: 'Successfully created', roomId: savedRoom._id });
        }
    });
};

const updateRoom = async (roomId, field, value) => {
    let updateObj = {};
    if (field === 'roomPlaylist') {
        updateObj.currentPlaylist = value;
    } else if (field === 'privacy') {
        const { isPrivate, password } = value;
        updateObj.public = !isPrivate;
        updateObj.password = isPrivate ? password : '';
    } else {
        updateObj[field] = value;
    }

    const updatedRoom = await Room.findByIdAndUpdate(roomId, updateObj, { new: true });
    return updatedRoom;
};

const deleteRoom = async (req, res) => {
    const { roomId } = req.params;
    if (!roomId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(403).json({ message: `Invalid room id` });
    }

    const room = await Room.findById(roomId);
    if (!room) {
        return res.status(404).json({ message: `No room found with id ${roomId}` });
    }

    const token = req.headers['x-access-token'];
    const payload = decodeToken(token);
    const roomUser = await User.findOne({ username: payload.sub });
    if (roomUser._id.toString() != room.authorId.toString()) {
        return res.status(404).json({ message: `Access denied` });
    }

    const roomUsers = await User.find({ username: { $in: room.usersOnline } });
    for (user of roomUsers) {
        User.findOneAndUpdate({ username: user.username }, { currentRoom: null }).exec();
    }

    Room.findByIdAndRemove(roomId, err => {
        if (err) res.status(500).json({ message: 'Error while deleting room' });
        else res.json({ message: 'Successfully deleted', roomId });
    });
};

const getRoom = async (req, res) => {
    const { roomId } = req.params;
    if (!roomId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(403).json({ message: `Invalid room id` });
    }

    const room = await Room.findById(roomId);
    if (!room) {
        return res.status(404).json({ message: `No room found with id ${roomId}` });
    }

    return res.send(room);
};

const enterRoom = async (roomId, username) => {
    const room = await Room.findById(roomId);
    if (!room.usersOnline.includes(username)) {
        room.usersOnline.push(username);
        Room.findByIdAndUpdate(roomId, { usersOnline: room.usersOnline }).exec();
        User.findOneAndUpdate({ username }, { currentRoom: roomId }).exec();
        return true;
    }

    return false;
};

const exitRoom = async (roomId, username) => {
    const room = await Room.findById(roomId);
    if (room.usersOnline.includes(username)) {
        const userIndex = room.usersOnline.indexOf(username);
        room.usersOnline.splice(userIndex, 1);
        Room.findByIdAndUpdate(roomId, { usersOnline: room.usersOnline }).exec();
        User.findOneAndUpdate({ username }, { currentRoom: null }).exec();
        return true;
    }

    return false;
};

const getRoomPlaylist = async (req, res) => {
    const { roomId, playlistId } = req.params;
    const room = await Room.findById(roomId);
    if (!room) {
        return res.status(404).json({ message: `No room found with id ${roomId}` });
    }

    if (room.currentPlaylist != playlistId) {
        return res.status(403).json({ message: `Access denied` });
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        return res.status(404).json({ message: `No playlist found with id ${playlistId}` });
    }

    const playlistTracks = await Track.find({ _id: { $in: playlist.tracks } });
    const sortPlaylist = (tracks, playlistTracks) => {
        return tracks.sort((a, b) => {
            return playlistTracks.indexOf(a._id) - playlistTracks.indexOf(b._id);
        });
    };

    return res.send(sortPlaylist(playlistTracks, playlist.tracks));
};

const sendMessage = async (roomId, username, message) => {
    const room = await Room.findById(roomId);
    message = {
        user: username, ...message
    };
    room.messages.push(message);
    Room.findByIdAndUpdate(roomId, { messages: room.messages }).exec();
    return message;
};

const kickUser = async (roomId, username) => {
    return exitRoom(roomId, username);
};

module.exports = {
    getRoomsPage, createRoom, getRoom, getRoomPlaylist, enterRoom, deleteRoom,
    exitRoom, sendMessage, kickUser, updateRoom
};
