const mongoose = require('mongoose');

const Ambassador = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    referralCode: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
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
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type:Date
    }
})

module.exports = mongoose.model('ambassador', Ambassador);