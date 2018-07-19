const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/sound-around-db');

const Track = require('./Track');
const User = require('./User');
const Playlist = require('./Playlist');
const Room = require('./Room');
const Settings = require('./Settings');

const main = async () => {
    //const track = await Track.findOne({ artist: 'Crown the Empire' });
    const user = await User.findOne({ username: 'alex' });

    // const playlist = new Playlist({
    //     authorId: new ObjectId(),
    //     authorUsername: 'Keks',
    //     tracks: [track._id],
    //     title: 'My playlist',
    //     lastUpdatedDate: new Date(),
    //     lastUsedDate: new Date(),
    //     createdDate: new Date(),
    //     usersLinks: 1,
    //     playlistPicture: {
    //         format: 'jpg',
    //         data: new Buffer('sss')
    //     }
    // });
    
    // await playlist.save(err => console.log(err));

    // const room = new Room({
    //     authorId: new ObjectId(),
    //     name: 'Room 1',
    //     description: 'Top room in the world',
    //     public: false,
    //     password: 'Topaz123',
    //     currentPlaylist: playlist,
    //     nowPlaying: track,
    //     users: [user],
    //     messages: [{
    //         user,
    //         text: 'Hello',
    //         date: new Date()
    //     }]
    // });

    // await room.save(err => console.log(err));

    const s = {
        key: 'kek',
        value: '123'
    };

    const setttings = new Settings({
        userId: user._id,
        settings: [s]
    });

    await setttings.save(err => console.log(err));
};

main();
