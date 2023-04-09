const router = require('express').Router();

router.use('/admin', require('./admin'));
// router.use('/events', require('./admin'));
// router.use('/ca', require('./ambassadors'));

module.exports = router;