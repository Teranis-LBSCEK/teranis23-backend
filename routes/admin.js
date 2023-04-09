const router = require('express').Router();
//const multer = require('multer');

//const authorize = require('../middlewares/auth');
const { adminSignin } = require('../controllers/auth')

//const upload = multer()

router.post('/login', adminSignin); 

module.exports = router;