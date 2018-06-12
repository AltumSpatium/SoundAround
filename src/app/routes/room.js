const moment = require('moment');
const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose');

const User = require('../models/User');
const Track = require('../models/Track');
const Playlist = require('../models/Playlist');
const Room = require('../models/Room');

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

};

const updateRoom = async (req, res) => {

};

const deleteRoom = async (req, res) => {

};

const getRoom = async (req, res) => {

};

const enterRoom = async (req, res) => {

};



module.exports = {
    getRoomsPage, createRoom
};
