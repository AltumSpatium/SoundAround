const jwt = require('jsonwebtoken');
const moment = require('moment');
const User = require('../models/User');

const createToken = username => {
    const payload = {
        sub: username,
        exp: moment().add(7, 'day').unix()
    };
    return jwt.sign(payload, 'TOPAZ123');
};

const validate = (str, re) => !!str.match(re);

const signup = async (req, res) => {
    const { username, password } = req.body;
    if (!validate(username, /^\w+$/) || !validate(password, /^\w{8,}$/)) {
        return res.status(400).json({ message: 'Username/password is incorrect' });
    }

    //const userByEmail = User.findOne({ email: req.body.email });
    const userByUsername = User.findOne({ username: req.body.username });
    
    //if (await userByEmail !== null) {
    //    return res.status(409).json({ message: 'Email is already taken' });
    //}
    if (await userByUsername !== null) {
        return res.status(409).json({ message: 'Username is already taken' });
    }

    const user = new User({ ...req.body });
    user.save((err, savedUser) => {
        if (err) res.send(err);
        res.json({ token: createToken(savedUser.username) });
    });
};

const login = async (req, res) => {
    const { username, password } = req.body;
    if (!validate(username, /^\w+$/) || !validate(password, /^\w{8,}$/)) {
        return res.status(400).json({ message: 'Username/password is incorrect' });
    }

    const user = await User.findOne({ username: username });
    if (!user) {
        return res.status(401).json({ message: 'Invalid username/password' });
    }

    user.comparePassword(password, (err, isMatch) => {
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username/password' });
        }
        res.json({ token: createToken(user.username) });
    });
};

const verifyAuth = () => {

}

module.exports = {
    signup, login, verifyAuth
};
