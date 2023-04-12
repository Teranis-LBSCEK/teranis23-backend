const bcrypt = require('bcryptjs');
const libphonenumberJs = require("libphonenumber-js");

const Ambassador = require('../models/Ambassador')

const errorWrapper = require('../middlewares/errorWrapper');
const uploadFiles = require('../functions/uploadFile');
const { generateReferralCode } = require('../utils/functions');

module.exports.caSignUp = errorWrapper(async (req, res) => {
    
    const phoneNumber = libphonenumberJs.parsePhoneNumberFromString(req.body.phone.toString(), 'IN');
    if(!phoneNumber.isValid()) {
        return res.status(400).json({ 
            success: false,
            message: 'Invalid phone number' 
        });
    }

    const user = await Ambassador.findOne({ $or: [ {email: req.body.email}, { phone: req.body.phone } ] })
    if(user) {
        return res.status(400).json({
            success: false,
            message: "A CA is already existed with the same email and phone"
        });
    };

    const password = await bcrypt.hash(req.body.password, 10);

    const newCa = new Ambassador({
        name: req.body.name,
        referralCode: await generateReferralCode(),
        phone: phoneNumber.number,
        email: req.body.email,
        password,
        profileUrl: req.files.length > 0 ? await uploadFiles(req.files) : undefined,
        college: req.body.college,
        dept: req.body.dept,
        semester: req.body.semester,
    })

    await newCa.save();

    res.status(200).json({
        success: true,
        message: "Campus ambassador signed successfully",
        data: newCa
    })
});

module.exports.profile = errorWrapper(async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Campus ambassador profile fetehed successfully",
        data: await Ambassador.findById(req.user.id).select('-password')
    })
});

module.exports.leaderboard = errorWrapper(async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Campus ambassador profile fetehed successfully",
        data: await Ambassador.find().select('-password').sort({score: 1})
    })
})