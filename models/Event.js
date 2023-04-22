const mongoose = require('mongoose');

const Event = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    uniqueName: {
        type: String,
        unique: true,
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
    featured: {
        type: Boolean,
        default: false,
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
    contact: {
        type: String,
    },
    lastDate: {
        type: String,
    },
    venue: {
        type: String,
    },
    status: {
        type: String,
        default: 'Opened',
        enum: ['Opened', 'Closed']
    },
    whatsappLink: {
        type: String
    },
    bannerUrl: {
        type: String,
        required: true,
    },
    registrations: [{
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
        paymentUrl: {
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
        },
        referralCode: {
            type: String
        },
        status: {
            type: String,
            default: 'Pending'
        },
        certificateDispersed: {
            type: Boolean,
            default: false,
        }
    }],
})

module.exports = mongoose.model('event', Event);