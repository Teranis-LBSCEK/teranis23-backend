const Event = require('../models/Event');

const errorWrapper = require('../middlewares/errorWrapper');
const uploadFiles = require('../functions/uploadFile');
const { generateReferralCode } = require('../utils/functions');

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
    const event = await Event.findById(req.params.eventId);
    if(!event) {
        return res.status(400).json({
            success: false,
            message: "Event not found"
        });
    }

    event.name =  req.body.name;
    event.desc = req.body.desc;
    event.prize =  req.body.prize;
    event.fee = req.body.fee;
    event.eventType = req.body.eventType;
    event.date = req.body.date;
    event.from = req.body.from;
    event.to = req.body.to;
    event.bannerUrl =  req.files.length > 0 ? await uploadFiles(req.files) : event.bannerUrl

    await event.save();

    res.status(200).json({
        success: true,
        message: "Event updated successfully",
        data: event
    })
})

module.exports.deleteEvent = errorWrapper(async (req, res) => {
    const event = await Event.findOneAndDelete({ _id: req.params.eventId});
    if(!event) {
        return res.status(400).json({
            success: false,
            message: "Event not found"
        });
    }

    res.status(200).json({
        success: true,
        message: "Event deleted successfully",
        data: event.name
    })
})

module.exports.registeredStudents = errorWrapper(async (req, res) => {
    const event = await Event.findById(req.params.eventId)
    res.status(200).json({
        success: true,
        message: "students list fetched successfully",
        data: event.registeredStudents
    })
});

module.exports.registerEvent = errorWrapper(async (req, res) => {
    const event = await Event.findById(req.params.eventId);
    if(!event) {
        return res.status(400).json({
            success: false,
            message: "Event not found"
        });
    }

    const entry = {
        name: req.body.name,
        contact: req.body.contact,
        email: req.body.email,
        paymentId: await generateReferralCode(),
        college: req.body.college,
        dept: req.body.dept,
        semester: req.body.semester
    }

    event.registeredStudents.push(entry);
    await event.save();

    res.status(200).json({
        success: true,
        message: "Registration successfull",
        data: entry
    })    
})