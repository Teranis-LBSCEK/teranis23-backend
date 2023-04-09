const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const errorWrapper = require('../middlewares/errorWrapper');

//const User = require('../models/User');

const libphonenumberJs = require("libphonenumber-js");
const twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

module.exports.signin = errorWrapper(async (req, res) => {
  const phoneNumber = libphonenumberJs.parsePhoneNumberFromString(req.body.phone.toString(), 'IN');

  if(!phoneNumber.isValid()) {
    return res.status(400).json({ 
        success: false,
        message: 'Invalid phone numberr' 
    });
  }

  const user  = await User.findOne({ phone: phoneNumber.number });

  if (!user) {
      return res.status(400).json({success: false, message: "User not found with the phone number"});
  }

  const otp = Math.floor(100000 + Math.random() * 900000); //6 digit integer otp

  user.otp = otp;
  user.otpExpires = Date.now() + 3600000; // 1 hour
  await user.save();


  twilio.messages.create({
    from: process.env.TWILIO_NUMBER,
    to: user.phone,
    body: `Hi ${user.name},\n` +
    `This is your OTP for Signapp:\n`+
    otp

  }).then(() => {
      res.status(200).json({
        success: true,
        message: "OTP sent to your phone number",
      }); 
  })
});

module.exports.submitOtp = errorWrapper(async (req, res) => {

  const user = await User.findOne({ otp: req.body.otp, otpExpires: { $gt: Date.now() } });
  if (!user) {
    return res.status(400).json({success: false, message: "OTP is invalid or has expired"});
  }

  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  const payload = {
    user: {
      id: user.id,
      role: user.role
    }
  };
  req.user = {...user};
  return jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1 year' },
      async (err, token) => {
          if (err) throw err;
          res.status(200).json({
            success: true,
            message: "Login successfull",
            token,
            user
          });
      }
  );
});

module.exports.adminSignin = async (req, res) => {

  try {
    if(req.body.email!= "teranis23curator@lbscek.ac.in" || req.body.password!= "teranis@123$%") {
      return res.status(400).json({success: false, message: "Invalid username or password"});
    }

    const payload = {
        user: {
          id: 'admin',
          role: "admin"
        }
    };
    req.user = {role: "admin"};
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1 year' },
        async (err, token) => {
            if (err) throw err;
            res.status(200).json({
              success: true,
              message: "Teranis admin Login successfull",
              token,
            });
        }
    );
  } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      })
  }
};