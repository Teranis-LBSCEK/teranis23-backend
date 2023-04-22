const router = require('express').Router();
const multer = require('multer');

const { createEvent, getEvents, editEvent, deleteEvent, registeredStudents, registerEvent, approveRegistration, changeEventStatus, getEventByName } = require('../controllers/events')
const authorize = require('../middlewares/auth');

const upload = multer()

router.post('/', authorize(["admin"]), upload.array('banner'), createEvent);
router.get('/', getEvents);
router.get('/:uniqueName', getEventByName);
router.put('/approve-registration', authorize(["admin"]), approveRegistration)
router.get('/get-registrations', authorize(["admin"]), registeredStudents)
router.post('/register/:eventId', upload.array('payment'), registerEvent),
router.put('/:eventId', authorize(["admin"]), upload.array('banner'), editEvent);
router.put('/change-status/:eventId', authorize(["admin"]), changeEventStatus)
router.delete('/:eventId', authorize(["admin"]), deleteEvent);

module.exports = router;