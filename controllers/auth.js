const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const errorWrapper = require('../middlewares/errorWrapper');
const { sendEmail } = require('../functions/sendEmail');

const Ambassador = require('../models/Ambassador')

module.exports.caSignin = errorWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user  = await Ambassador.findOne({ email });
  if (!user) {
      return res.status(400).json({success: false, message: "User not found with the email id"});
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
      return res.status(401).json({ "status": "error", "message": "Incorrect password" });
  }

  const userObj = user.toJSON()
  delete userObj.password;

  const payload = {
    user: {
      id: userObj._id,
      role: "ca",
      refferalCode: userObj.refferalCode
    }
  };


  return jwt.sign(
      payload,
      process.env.JWT_SECRET,
      async (err, token) => {
          if (err) throw err;
          res.status(200).json({
            success: true,
            message: "Login successfull",
            data: {
              token,
              userData: userObj,
            }
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

module.exports.forgotPassword = errorWrapper(async (req, res) => {
  const user  = await Ambassador.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({success: false, message: "CA not found with the email"});
  }
  var buf = await crypto.randomBytes(20)
  var token = buf.toString('hex');

  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  const message = '<p>You are receiving this because you (or someone else) have requested the reset of the password for your Campus ambassador profile in Teranis 23.<br></p>'+
        '<p>Please click on the following link, or paste this into your browser to complete the process:<br>' +
        '<a href="https://teranis.in/password-reset/ca/' + token + '">Click here</a></p>' +
        'If you did not request this, please ignore this email and your password will remain unchanged.<br>'+
        'Please note that the link is active only for 1 hour.';

  await sendEmail([req.body.email], '', 'Teranis 23 - Request for password reset', message);
  res.status(200).json({
    success: true,
    message: "A link to reset your password has been sent to your email",
  });
});

module.exports.submitPassword = async (req, res) => {
  const user = await Ambassador.findOne({ resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() } });
  if (!user) {
    return res.status(400).json({success: false, message: "Password reset token is invalid or has expired"});
  }

  const password = await bcrypt.hash(req.body.password, 10);

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  const userObj = user.toJSON()
  delete userObj.password;

  req.user = userObj;

  const payload = {
    user: {
      id: userObj._id,
      role: "ca",
      refferalCode: userObj.refferalCode
    }
};

return jwt.sign(
  payload,
  process.env.JWT_SECRET,
  { expiresIn: '1 year' },
  async (err, token) => {
      if (err) throw err;
      res.status(200).json({
        success: true,
        message: "Password changed",
        data: {
          token,
          userData: userObj,
        }
      });
  }
);
}