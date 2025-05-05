const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { authenticate } = require('../../../middlewares/authMiddleware');

// Apply auth middleware to all routes
router.use(authenticate);

// Mentor routes
router.post('/', assignmentController.createAssignment);
router.get('/mentor', assignmentController.getMentorAssignments);
router.patch('/:assignmentId/grade', assignmentController.gradeAssignment);

// Student routes
router.get('/student', assignmentController.getStudentAssignments);
router.post('/:assignmentId/submit', assignmentController.submitAssignment);

module.exports = router; 