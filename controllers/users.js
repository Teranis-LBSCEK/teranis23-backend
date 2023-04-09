const User = require('../models/User');

const libphonenumberJs = require("libphonenumber-js");

const errorWrapper = require('../middlewares/errorWrapper');

module.exports.addUser = errorWrapper(async (req, res) => {
    const phoneNumber = libphonenumberJs.parsePhoneNumberFromString(req.body.phone.toString(), 'IN');
    if(!phoneNumber.isValid()) {
        return res.status(400).json({ 
            success: false,
            message: 'Invalid phone numberr' 
        });
    }

    const user = await User.findOne({ phone: phoneNumber.number });
    if (user) {
        return res.status(400).json({ 
            success: false,
            message: 'Member already exists with this phone number' 
        });
    }

    const newUser = new User({
        admin: req.user.id,
        name: req.body.name,
        phone: phoneNumber.number,
        role: "user",
        address: req.body.address
    });

    await newUser.save();

    res.status(200).json({
        success: true,
        message: "User added successfully",
        data: newUser
    })
});

module.exports.getMembers = errorWrapper(async (req, res) => {
    let users ;
    if(req.user.role === 'superadmin') {
        users = await User.find({ role: 'user'})
    } else if(req.user.role === 'admin') {
        users = await User.find({ role: 'user', admin: req.user.id})
    }

    res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: users
    })
});

module.exports.editMember = errorWrapper(async (req, res) => {
    const user = await User.findOne({_id: req.params.userId, role: 'user', admin: req.user.id });
    if(!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    const phoneNumber = libphonenumberJs.parsePhoneNumberFromString(req.body.phone.toString(), 'IN');
    if(!phoneNumber.isValid()) {
        return res.status(400).json({ 
            success: false,
            message: 'Invalid phone numberr' 
        });
    }

    user.name = req.body?.name,
    user.phone = phoneNumber?.number,
    user.address = req.body?.address,

    await user.save();

    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: user
    })
});

module.exports.deleteMember = errorWrapper(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }
    res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: {
            name: user.name,
            phone: user.phone
        }
    })
})