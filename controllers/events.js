const libphonenumberJs = require("libphonenumber-js");

const Event = require('../models/Event');

const errorWrapper = require('../middlewares/errorWrapper');
const uploadFiles = require('../functions/uploadFile');
const { generateReferralCode } = require('../utils/functions');

module.exports.createEvent = errorWrapper(async (req, res) => {

    const phoneNumber = libphonenumberJs.parsePhoneNumberFromString(req.body.contact.toString(), 'IN');
    if(!phoneNumber.isValid()) {
        return res.status(400).json({ 
            success: false,
            message: 'Invalid contact number provided' 
        });
    }
    
    const newEvent = new Event({
        name: req.body.name,
        fee: req.body.fee,
        desc: req.body.desc,
        prize: req.body.prize,
        eventType: req.body.eventType,
        featured: req.body.featured,
        date: req.body.date,
        from: req.body.from,
        to: req.body.to,
        contact: phoneNumber.number,
        lastDate: req.body.lastDate,
        venue: req.body.venue,
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
        data: await Event.find().select('-registrations')
    })
})

module.exports.editEvent = errorWrapper(async (req, res) => {
    const phoneNumber = libphonenumberJs.parsePhoneNumberFromString(req.body.contact.toString(), 'IN');
    if(!phoneNumber.isValid()) {
        return res.status(400).json({ 
            success: false,
            message: 'Invalid contact number provided' 
        });
    }

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
    event.featured = req.body.featured;
    event.from = req.body.from;
    event.to = req.body.to;
    event.contact =  phoneNumber.number,
    event.lastDate =  req.body.lastDate,
    event.venue =  req.body.venue,
    event.bannerUrl =  req.files.length > 0 ? await uploadFiles(req.files) : event.bannerUrl

    await event.save();

    res.status(200).json({
        success: true,
        message: "Event updated successfully",
        data: event
    })
})

module.exports.changeEventStatus = errorWrapper(async (req, res) => {
    const event = await Event.updateOne({ _id: req.params.eventId}, { status: req.body.status});
    
    if(event.modifiedCount > 0) {
        return res.status(200).json({
            success: true,
            message: "Event updated successfully",
        })
    }

    res.status(400).json({
        success: false,
        message: "Unable to update event"
    });
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

    const event = await Event.findOne({ _id: req.query.eventId }); 
    
    if(!event) {
        return res.status(400).json({
            success: false,
            message: "Event not found"
        });
    }

    if(req.query.status) {
        const list = []
        event.registrations.forEach(entry => {
            if(entry.status === req.query.status) {
                list.push(entry)
            }
        });

        return res.status(200).json({
            success: true,
            message: "Registrations fetched successfully",
            data: list
        })
    }

    res.status(200).json({
        success: true,
        message: "Registrations fetched successfully",
        data: event.registrations
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

    event.registrations.push(entry);
    await event.save();

    res.status(200).json({
        success: true,
        message: "Registration successfull",
        data: entry
    })    
});

module.exports.approveRegistration = errorWrapper(async (req, res) => {
    const event = await Event.updateOne(
        { _id: req.body.eventId, 'registrations._id': req.body.regId },
        { $set: { 'registrations.$.status': 'Approved' } }
    )

    if(event.modifiedCount > 0) {
        return res.status(200).json({
            success: true,
            message: "Registration approved successfully",
            data: null
        })
    }

    res.status(400).json({
        success: false,
        message: "Entry not found or already approved, registration not updated"
    });
    

});