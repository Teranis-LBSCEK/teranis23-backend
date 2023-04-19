const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const libphonenumberJs = require("libphonenumber-js");

const Ambassador = require('../models/Ambassador')

const { sendEmail } = require('../functions/sendEmail');
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

    const userObj = newCa.toJSON()
    delete userObj.password;

    const payload = {
        user: {
        id: userObj._id,
        role: "ca",
        refferalCode: userObj.refferalCode
        }
    };

    jwt.sign(
        payload,
        process.env.JWT_SECRET,
        async (err, token) => {
            if (err) throw err;
            res.status(200).json({
                success: true,
                message: "Campus ambassador signed successfully",
                data: {
                    token,
                    userData: userObj,
                }
            });
        }
    );

//     const message = `<p>Hi ${newCa.name},</p><br><p> Thank you for registering as a Campus ambassador profile in Teranis 23.<br></p>`+
//         '<p><br>' + 
//         '' +
//         ''
        

//   await sendEmail([req.body.email], '', 'Teranis 23 - Request for password reset', message);
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
        message: "Campus ambassador profile fetched successfully",
        data: await Ambassador.find().select(['name', 'college', 'score', 'profileUrl']).sort({score: -1})
    })
});

module.exports.getAll = errorWrapper(async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Campus ambassador profile fetehed successfully",
        data: await Ambassador.find().select('-password')
    })
});

module.exports.verifyReferralCode = errorWrapper(async (req, res) => {
    if(
        await Ambassador.findOne({ referralCode: req.body.referralCode})
    ) {
        res.status(200).json({
            success: true,
            message: "Verified",
            data: req.body.referralCode
        })
    } else {
        res.status(400).json({
            success: false,
            message: "Unverified",
            data: null
        })
    }
});

module.exports.deleteCa  = errorWrapper(async (req, res) => {
    const ca = await Ambassador.findOneAndDelete({ _id: req.params.caId});
    if(!ca) {
        return res.status(400).json({
            success: false,
            message: "CA not found"
        });
    }

    res.status(200).json({
        success: true,
        message: "CA deleted successfully",
        data: ca.name
    })
})