const express = require('express');
const router = express.Router();
const { authenticate } = require('../../../middlewares/authMiddleware');
const progressController = require('../controllers/progressController');

// Apply auth middleware to all routes
router.use(authenticate);

// Create a new progress milestone
router.post('/', progressController.createProgress);

// Get all progress for a student
router.get('/student/:studentId', progressController.getStudentProgress);

// Update progress status
router.patch('/:progressId/status', progressController.updateProgressStatus);

// Get progress metrics for a student
router.get('/student/:studentId/metrics', progressController.getProgressMetrics);

module.exports = router; 