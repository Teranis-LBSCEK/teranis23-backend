const mongoose = require('mongoose');

const Event = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
    },
    prize: {
        type: String,
    },
    fee: {
        type: Number,
    },
    eventType: {
        type: String,
        //enum: ['webinar', 'workshop', 'pre-event', ]
    },
    date: {
        type: String,
        required: true,
    },
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    bannerUrl: {
        type: String,
        required: true,
    },
    registeredStudents: [{
        name: {
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
        paymentId: {
            type: String,
            required: true,
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
        }
    }],
})

module.exports = mongoose.model('event', Event);