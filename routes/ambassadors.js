const router = require('express').Router();

const authorize = require('../middlewares/auth');

const { profile, leaderboard, getAll } = require('../controllers/ambassador');

router.get('/', authorize(["admin"]), getAll);
router.get('/profile', authorize(["ca"]), profile);
router.get('/leaderboard', leaderboard);

module.exports = router;