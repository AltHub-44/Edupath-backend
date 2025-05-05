const express = require('express');
const router = express.Router();
const { authenticate } = require('../../../middlewares/authMiddleware');
const progressController = require('../controllers/progressController');

// Create a new progress milestone
router.post('/', 
  authenticate,
  progressController.createProgress
);

// Get all progress for a student
router.get('/student/:studentId',
  authenticate,
  progressController.getStudentProgress
);

// Update progress status
router.patch('/:progressId/status',
  authenticate,
  progressController.updateProgressStatus
);

// Get progress metrics for a student
router.get('/student/:studentId/metrics',
  authenticate,
  progressController.getProgressMetrics
);

module.exports = router; 