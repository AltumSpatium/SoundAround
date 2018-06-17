const Express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json({limit: '50mb'});
const urlencodedParser = bodyParser.urlencoded({limit: '50mb', extended: true});
const socketio = require('socket.io');

const uploadsDirname = path.join(__dirname , '/build/uploads');
const multer = require('multer');
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, uploadsDirname),
        filename: (req, file, cb) => cb(null, file.originalname)
    })
});

if (!fs.existsSync(uploadsDirname)) {
    fs.mkdirSync(uploadsDirname)
}

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:Topaz123_@ds131989.mlab.com:31989/sound-around-db', { useMongoClient: true });

const { signup, login, verifyAuth, verifyUser, decodeToken } = require('./src/app/routes/auth');
const { getUser, updateUser, deleteUser } = require('./src/app/routes/user');
const {
    getUserMusic, uploadUserMusic, addTrack, updateTrack, deleteTrack,
    getTrack
} = require('./src/app/routes/music');
const {
    getUserPlaylist, createPlaylist, getPlaylistTracks,
    updatePlaylist, getPlaylists, deletePlaylist
} = require('./src/app/routes/playlist');
const {
    getRoomsPage, createRoom, getRoom, getRoomPlaylist, deleteRoom,
    enterRoom, exitRoom, sendMessage
} = require('./src/app/routes/room');

const app = new Express();
const io = socketio();
const port = process.env.PORT || 8000;

app.use(Express.static(path.join(__dirname , '/build')));
app.use(jsonParser);
app.use(urlencodedParser);

app.post('/api/auth/login', login);
app.post('/api/auth/signup', signup);

app.route('/api/user/:username')
    .get(verifyAuth, verifyUser, getUser)
    .put(verifyAuth, verifyUser, updateUser)
    .delete(verifyAuth, verifyUser, deleteUser);

app.route('/api/music/list/:username')
    .get(verifyAuth, verifyUser, getUserMusic)
    .post(verifyAuth, verifyUser, upload.single('audio'), uploadUserMusic);

app.route('/api/music/track/:trackId')
    .get(verifyAuth, getTrack);

app.route('/api/music/:username/:trackId')
    .get(verifyAuth, verifyUser, addTrack)
    .put(verifyAuth, verifyUser, updateTrack)
    .delete(verifyAuth, verifyUser, deleteTrack);

app.route('/api/playlists/list/:playlistId')
    .get(verifyAuth, getUserPlaylist)
    .put(verifyAuth, updatePlaylist);

app.route('/api/playlists/music/:username/:playlistId')
    .get(verifyAuth, getPlaylistTracks)
    .delete(verifyAuth, verifyUser, deletePlaylist);

app.route('/api/playlists/:username')
    .get(verifyAuth, verifyUser, getPlaylists)
    .post(verifyAuth, verifyUser, createPlaylist);

app.route('/api/rooms/list')
    .get(verifyAuth, getRoomsPage);

app.route('/api/rooms/list/:roomId')
    .get(verifyAuth, getRoom)
    .delete(verifyAuth, deleteRoom);

app.get('/api/rooms/list/:roomId/playlist/:playlistId/:userId', verifyAuth, getRoomPlaylist);

app.route('/api/rooms/:username')
    .post(verifyAuth, verifyUser, createRoom);

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/build/index.html'));
});

const server = app.listen(port, error => {
    if (error) console.log(error);
    else console.info(`==> Listening on port ${port}`);
});

io.listen(server);

io.on('connection', client => {
    client.on('enterRoom', async obj => {
        const { roomId, username } = obj;
        const shouldUpdate = await enterRoom(roomId, username);
        client.join(roomId);
        if (shouldUpdate) {
            io.to(roomId).emit('enterRoom', obj);
        }
    });

    client.on('exitRoom', async obj => {
        const { roomId, username } = obj;
        const shouldUpdate = await exitRoom(roomId, username);
        if (shouldUpdate) {
            io.to(roomId).emit('exitRoom', obj);
        }
        client.leave(roomId);
    });

    client.on('message', async obj => {
        const { message, roomId, username } = obj;
        const msg = await sendMessage(roomId, username, message);
        client.broadcast.to(roomId).emit('message', msg);
    });

    client.on('deleteRoom', async obj => {
        const { roomId } = obj;
        io.to(roomId).emit('deleteRoom');
    });
});
