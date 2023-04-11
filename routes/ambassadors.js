const router = require('express').Router();

const authorize = require('../middlewares/auth');

const { profile, leaderboard } = require('../controllers/ambassador');

router.get('/profile', authorize(["ca"]), profile);
router.get('/leaderboard', leaderboard);

module.exports = router;