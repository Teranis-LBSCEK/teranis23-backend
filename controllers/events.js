const Event = require('../models/Event');

const errorWrapper = require('../middlewares/errorWrapper');
const uploadFiles = require('../functions/uploadFile');

module.exports.createEvent = errorWrapper(async (req, res) => {
    
    const newEvent = new Event({
        name: req.body.name,
        fee: req.body.fee,
        desc: req.body.desc,
        prize: req.body.prize,
        eventType: req.body.eventType,
        date: req.body.date,
        from: req.body.from,
        to: req.body.to,
        bannerUrl: await uploadFiles(req.files)
    });

    await newEvent.save();

    res.status(200).json({
        success: true,
        message: "Event created successfully",
        data: newEvent
    })
})

module.exports.getEvents = errorWrapper(async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Events fetched successfully",
        data: await Event.find()
    })
})

module.exports.editEvent = errorWrapper(async (req, res) => {
    
})

module.exports.deleteEvent = errorWrapper(async (req, res) => {
    
})