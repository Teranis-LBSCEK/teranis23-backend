const router = require('express').Router();

//const authorize = require('../middlewares/auth');
const { adminSignin } = require('../controllers/auth')

router.post('/login', adminSignin); 

module.exports = router;