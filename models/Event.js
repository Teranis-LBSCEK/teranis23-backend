const mongoose = require('mongoose');

const Event = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    fee: {
        type: Number,
        required: true
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
    regsiteredStudents: [{
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