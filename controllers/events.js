const libphonenumberJs = require("libphonenumber-js");

const Event = require('../models/Event');
const Ambassador = require('../models/Ambassador');

const { sendEmail } = require('../functions/sendEmail');
const errorWrapper = require('../middlewares/errorWrapper');
const uploadFiles = require('../functions/uploadFile');

module.exports.createEvent = errorWrapper(async (req, res) => {

    if(req.files.length == 0) {
        return res.status(400).json({ 
            success: false,
            message: 'Banner image is required' 
        });
    }

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

    if(req.files.length == 0) {
        return res.status(400).json({ 
            success: false,
            message: 'Payment screenshot is required' 
        });
    }

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
        paymentUrl: await uploadFiles(req.files),
        college: req.body.college,
        dept: req.body.dept,
        semester: req.body.semester,
        referralCode: req.body.referralCode
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

    const event = await Event.findById(req.body.eventId);
    if (!event) {
        return res.status(400).json({
            success: false,
            message: "Event not found"
        });
    }

    let flag = 0;
    let i ;
    for (i = 0; i < event.registrations.length; i++) {
        if(event.registrations[i].id == req.body.regId && event.registrations[i].status == 'Pending') {

            event.registrations[i].status = 'Approved';
            await event.save();

            if(event.registrations[i].referralCode) {
                await Ambassador.updateOne({ referralCode: event.registrations[i].referralCode}, { $inc: {score: 5}});
             }

            res.status(200).json({
                success: true,
                message: "Registration approved succesfully",
            }) 

            const message = `<p> Dear ${event.registrations[i].name},</p>`+
                `<p>We appreciate your interest of participating in <b>${event.name}</b> in our Technical Fest Teranis’23 and believe that you will find it to be a valuable experience.</p>`+
                `<p>If you have any questions or concerns, please do not hesitate to contact us.</p>`+
                '<p>Thank you again for registering, and we look forward to seeing you soon!</p>' + 
                '<p>Best regards,<br>Teranis’23<br> Dept of CSE & IT<br> LBSCEK</p>'

            await sendEmail([event.registrations[i].email], '', 'Congratulations! Your registration for an Event in Teranis 23 has approved.', message);
            flag ++;
            break;
        }
        
    }

    if (flag == 0) {
        return res.status(400).json({
            success: false,
            message: "Entry not found or already approved, registration not updated"
        });
    }

});