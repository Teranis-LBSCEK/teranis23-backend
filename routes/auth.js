const router = require('express').Router();
const multer = require('multer');

const { adminSignin, caSignin, forgotPassword, submitPassword } = require('../controllers/auth');
const { caSignUp } = require('../controllers/ambassador');

const upload = multer()

router.post('/login/admin', adminSignin); 
router.post('/login/ca', caSignin);
router.post('/signup/ca', upload.array('photo'), caSignUp);
router.post('/forgot-password/ca', forgotPassword);
router.post('/submit-password/ca', submitPassword);


module.exports = router;