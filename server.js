const Express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json({limit: '50mb'});
const urlencodedParser = bodyParser.urlencoded({limit: '50mb', extended: true});

const multer = require('multer');
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, './uploads'),
        filename: (req, file, cb) => cb(null, file.originalname)
    })
});

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:Topaz123_@ds131989.mlab.com:31989/sound-around-db', { useMongoClient: true });

const { signup, login, verifyAuth, verifyUser, decodeToken } = require('./src/app/routes/auth');
const { getUser, updateUser, deleteUser } = require('./src/app/routes/user');
const { getUserMusic, uploadUserMusic } = require('./src/app/routes/music');

const User = require('./src/app/models/User');

const app = new Express();
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

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/build/index.html'));
});

app.listen(port, error => {
    if (error) console.log(error);
    else console.info(`==> Listening on port ${port}`);
});
