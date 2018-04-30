const Express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json({limit: '50mb'});
const urlencodedParser = bodyParser.urlencoded({limit: '50mb', extended: true});

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:Topaz123_@ds131989.mlab.com:31989/sound-around-db', { useMongoClient: true });

const { signup, login, verifyAuth, verifyUser, decodeToken } = require('./src/app/routes/user');

const User = require('./src/app/models/User');

const app = new Express();
const port = process.env.PORT || 8000;

app.use(Express.static(path.join(__dirname , '/build')));
app.use(jsonParser);
app.use(urlencodedParser);

app.post('/api/auth/login', login);
app.post('/api/auth/signup', signup);

app.route('/api/user/:username')
    .get(verifyAuth, verifyUser, async (req, res) => {
        const username = req.params.username;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: `No user registered with username ${username}` });
        }

        return res.send(user);
    })
    .put(verifyAuth, verifyUser, async (req, res) => {
        const username = req.params.username;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: `No user registered with username ${username}` });
        }

        res.end();
    })
    .delete(verifyAuth, verifyUser, async (req, res) => {
        const username = req.params.username;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: `No user registered with username ${username}` });
        }

        await User.findOneAndRemove({ username });
        res.end();
    });

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/build/index.html'));
});

app.listen(port, error => {
    if (error) console.log(error);
    else console.info(`==> Listening on port ${port}`);
});
