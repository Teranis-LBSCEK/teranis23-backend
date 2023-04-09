const mongoose = require('mongoose');

const Ambassador = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    contact: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    profileUrl: {
        type: String,
    },
    college: {
        type: String,
        required: true,
    },
    dept: {
        type: String,
    },
    semester: {
        type: String
    },
    score: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('ambassador', Ambassador);