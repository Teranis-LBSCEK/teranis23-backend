const router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/events', require('./events'));
router.use('/ca', require('./ambassadors'));

module.exports = router;