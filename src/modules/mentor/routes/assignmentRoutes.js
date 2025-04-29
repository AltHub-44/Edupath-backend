const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { authenticateUser } = require('../../../middleware/authMiddleware');

// Protect all assignment routes
router.use(authenticateUser);

// Assignment CRUD operations
router.post('/', assignmentController.createAssignment);
router.post('/bulk', assignmentController.createBulkAssignments);
router.get('/', assignmentController.getAssignments);
router.get('/:assignmentId', assignmentController.getAssignmentById);
router.patch('/:assignmentId', assignmentController.updateAssignment);
router.delete('/:assignmentId', assignmentController.deleteAssignment);

// Assignment grading
router.post('/:assignmentId/grade', assignmentController.gradeAssignment);

// Assignment statistics
router.get('/statistics', assignmentController.getAssignmentStatistics);

// Student-specific assignments
router.get('/student/:studentId', assignmentController.getStudentAssignments);

// Template-based assignments
router.post('/template/:templateId', assignmentController.createAssignmentFromTemplate);

module.exports = router; 