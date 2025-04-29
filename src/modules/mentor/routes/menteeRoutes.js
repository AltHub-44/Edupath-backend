const express = require('express');
const router = express.Router();
const menteeController = require('../controllers/menteeController');
const { authenticateUser } = require('../../../middleware/authMiddleware');

// Protect all mentee management routes
router.use(authenticateUser);

// Get all mentees
router.get('/', menteeController.getAllMentees);

// Get specific mentee details
router.get('/:menteeId', menteeController.getMenteeDetails);

// Get mentee progress
router.get('/:menteeId/progress', menteeController.getMenteeProgress);

// Get mentee sessions
router.get('/:menteeId/sessions', menteeController.getMenteeSessions);

// Session Management
router.post('/:menteeId/sessions', menteeController.scheduleSession);
router.patch('/:menteeId/sessions/:sessionId', menteeController.updateSession);

// Progress Tracking
router.post('/:menteeId/progress', menteeController.addProgressUpdate);

// Communication
router.post('/:menteeId/messages', menteeController.sendMessage);
router.get('/:menteeId/messages', menteeController.getMessages);

module.exports = router; 