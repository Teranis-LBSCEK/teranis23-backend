const router = require('express').Router();

router.use('/admin', require('./admin'));
router.use('/events', require('./events'));
// router.use('/ca', require('./ambassadors'));

module.exports = router;