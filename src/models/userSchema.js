const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    salt: {
        type: String,
        required: [true, 'salt is required']
    },
    hash: {
        type: String,
        required: [true, 'hash is required']
    }
})

module.exports = mongoose.model('user', userSchema);
