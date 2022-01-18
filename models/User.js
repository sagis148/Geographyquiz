
const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    username: {
        type: String
    },
    score: {
        type:Number,
        default: 0
    },
    loggedIn: {
        type: Boolean,
        default: false
    },
    date: {
        type: String
    },
    registerDate: {
        type: Date,
        default: Date.now()
    },
    userId: Schema.ObjectId

})
user = mongoose.model('user', userSchema);
module.exports = user;
