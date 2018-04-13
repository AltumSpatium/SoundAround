const Express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json({limit: '50mb'});
const urlencodedParser = bodyParser.urlencoded({limit: '50mb', extended: true});

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:Topaz123_@ds131989.mlab.com:31989/sound-around-db', { useMongoClient: true });

const app = new Express();
const port = 3001;

app.use(Express.static(__dirname));
app.use(jsonParser);
app.use(urlencodedParser);

app.get('/*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, error => {
    if (error) console.log(error);
    else console.info(`==> Listening on port ${port}`);
});
