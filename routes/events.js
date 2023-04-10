const router = require('express').Router();
const multer = require('multer');

const { createEvent, getEvents, editEvent, deleteEvent } = require('../controllers/events')
const authorize = require('../middlewares/auth');

const upload = multer()

router.post('/',authorize(["admin"]), upload.array('banner'), createEvent);
router.get('/', getEvents);
router.put('/:eventId', editEvent);
router.delete('/:eventId', deleteEvent);

module.exports = router;