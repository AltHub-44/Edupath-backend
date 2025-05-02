const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const { authenticateUser } = require('../../../middlewares/authMiddleware');
const { validateCalendarEvent, validateAvailability, validateRecurringSession } = require('../../../middlewares/validation');

// Protect all calendar routes
router.use(authenticateUser);

// Calendar events
router.get('/events', calendarController.getCalendarEvents);
router.post('/events', validateCalendarEvent, calendarController.createCalendarEvent);
router.put('/events/:eventId', validateCalendarEvent, calendarController.updateCalendarEvent);
router.delete('/events/:eventId', calendarController.deleteCalendarEvent);

// Availability
router.get('/availability', calendarController.getAvailability);
router.post('/availability', validateAvailability, calendarController.setAvailability);

// Recurring sessions
router.post('/recurring-sessions', validateRecurringSession, calendarController.createRecurringSession);

// External calendar sync
router.post('/sync', calendarController.syncWithExternalCalendar);

module.exports = router; 