const router = require('express').Router();

const { superAdminSignin, signin, submitOtp } = require('../controllers/auth');

router.post('/login/superadmin', superAdminSignin);
router.post('/submit-otp', submitOtp);
router.post('/login', signin);

module.exports = router;