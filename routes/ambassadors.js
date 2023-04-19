const router = require('express').Router();

const authorize = require('../middlewares/auth');

const { profile, leaderboard, getAll, verifyReferralCode, deleteCa } = require('../controllers/ambassador');

router.get('/', authorize(["admin"]), getAll);
router.get('/profile', authorize(["ca"]), profile);
router.get('/leaderboard', leaderboard);
router.post('/verify-code', verifyReferralCode);
router.delete('/delete/:caId', authorize(["admin"]), deleteCa)

module.exports = router;