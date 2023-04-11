const router = require('express').Router();
const multer = require('multer');

const { createEvent, getEvents, editEvent, deleteEvent, registeredStudents, registerEvent } = require('../controllers/events')
const authorize = require('../middlewares/auth');

const upload = multer()

router.post('/', authorize(["admin"]), upload.array('banner'), createEvent);
router.get('/', getEvents);
router.put('/:eventId', authorize(["admin"]), upload.array('banner'), editEvent);
router.delete('/:eventId', authorize(["admin"]), deleteEvent);
router.get('/get-registrations/:eventId', authorize(["admin"]), registeredStudents)
router.post('/register/:eventId', registerEvent)

module.exports = router;