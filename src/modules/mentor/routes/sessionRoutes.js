const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const { authenticateUser } = require('../../../middleware/authMiddleware');
const { authenticate } = require('../../../middleware/auth');

// Protect all session management routes
router.use(authenticateUser);

// Calendar and session management
router.get('/calendar', sessionController.getCalendar);
router.get('/upcoming', sessionController.getUpcomingSessions);
router.get('/history', sessionController.getSessionHistory);

// Session operations
router.post('/', sessionController.scheduleSession);
router.patch('/:sessionId', sessionController.updateSession);

// Session Templates
router.get('/templates', authenticate, sessionController.getSessionTemplates);
router.post('/templates', authenticate, sessionController.createSessionTemplate);

module.exports = router; 