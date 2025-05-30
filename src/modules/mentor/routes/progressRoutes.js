const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../middlewares/authMiddleware');
const progressController = require('../controllers/progressController');

// Create a new progress milestone
router.post('/', 
  authMiddleware.authenticate,
  progressController.createProgress
);

// Get all progress for a student
router.get('/student/:studentId',
  authMiddleware.authenticate,
  progressController.getStudentProgress
);

// Update progress status
router.patch('/:progressId/status',
  authMiddleware.authenticate,
  progressController.updateProgressStatus
);

// Get progress metrics for a student
router.get('/student/:studentId/metrics',
  authMiddleware.authenticate,
  progressController.getProgressMetrics
);

module.exports = router; 