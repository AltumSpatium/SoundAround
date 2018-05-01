const User = require('../models/User');

const getUser = async (req, res) => {
    const username = req.params.username;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: `No user registered with username ${username}` });
    }
    return res.send(user);
};

const updateUser = async (req, res) => {
    const username = req.params.username;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: `No user registered with username ${username}` });
    }
    res.end();
};

const deleteUser = async (req, res) => {
    const username = req.params.username;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: `No user registered with username ${username}` });
    }
    await User.findOneAndRemove({ username });
    res.end();
};

module.exports = {
    getUser, updateUser, deleteUser
};
