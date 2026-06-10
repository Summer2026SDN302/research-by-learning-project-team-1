const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { createEventRules, updateEventRules } = require('../validators/eventValidator');
const validate = require('../middlewares/validate');
const { authenticate, authorize } = require('../middlewares/auth');

router.use(authenticate);

router.get('/', eventController.getEvents);
router.get('/my-events', eventController.getMyEvents);
router.get('/:id', eventController.getEventById);

router.post('/', authorize('admin', 'club_leader'), createEventRules, validate, eventController.createEvent);
router.put('/:id', authorize('admin', 'club_leader'), updateEventRules, validate, eventController.updateEvent);
router.delete('/:id', authorize('admin', 'club_leader'), eventController.deleteEvent);

router.post('/:id/register', eventController.registerForEvent);
router.post('/:id/cancel', eventController.cancelRegistration);
router.post('/:id/check-in', eventController.checkInParticipant);

module.exports = router;
