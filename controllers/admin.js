const User = require('../models/User');

const libphonenumberJs = require("libphonenumber-js");

const errorWrapper = require('../middlewares/errorWrapper');
const uploadFiles = require('../functions/uploadFile');

module.exports.createAdmin = errorWrapper(async (req, res) => {
    const phoneNumber = libphonenumberJs.parsePhoneNumberFromString(req.body.phone.toString(), 'IN');
    if(!phoneNumber.isValid()) {
        return res.status(400).json({ 
            success: false,
            message: 'Invalid phone number' 
        });
    }

    const user = await User.findOne({ phone: phoneNumber.number });
    if (user) {
        return res.status(400).json({ 
            success: false,
            message: 'User already exists with this phone number' 
        });
    }

    if(req.files.length == 0) {
        return res.status(400).json({ 
            success: false,
            message: 'Sign is required' 
        });
    }

    const newUser = new User({
        name: req.body.name,
        phone: phoneNumber.number,
        role: "admin",
        address: req.body.address,
        signUrl: await uploadFiles(req.files)
    });

    await newUser.save();

    res.status(200).json({
        success: true,
        message: "Admin added successfully",
        data: newUser
    })
});

module.exports.getAdmins = errorWrapper(async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Admins fetched successfully",
        data: await User.find({ role: 'admin' })
    })
});

module.exports.editAdmin = errorWrapper(async (req, res) => {
    const admin = await User.findOne({_id: req.params.adminId, role: 'admin' });
    if(!admin) {
        return res.status(404).json({
            success: false,
            message: "Admin not found"
        });
    }

    const phoneNumber = libphonenumberJs.parsePhoneNumberFromString(req.body.phone.toString(), 'IN');
    if(!phoneNumber.isValid()) {
        return res.status(400).json({ 
            success: false,
            message: 'Invalid phone numberr' 
        });
    }

    admin.name = req.body?.name,
    admin.phone = phoneNumber?.number,
    admin.address = req.body?.address,
    admin.signUrl = req.files.length > 0 ? await uploadFiles(req.files) : admin.signUrl

    await admin.save();

    res.status(200).json({
        success: true,
        message: "Admin updated successfully",
        data: admin
    })
});

module.exports.deleteAdmin = errorWrapper(async (req, res) => {
    const admin = await User.findByIdAndDelete(req.params.adminId);
    if(!admin) {
        return res.status(404).json({
            success: false,
            message: "Admin not found"
        });
    }
    res.status(200).json({
        success: true,
        message: "Admin deleted successfully",
        data: {
            name: admin.name,
        }
    })
});