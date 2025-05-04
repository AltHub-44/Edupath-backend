const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateUser } = require('../../../middleware/authMiddleware');

// Protect all mentor dashboard routes
router.use(authenticateUser);

// Dashboard overview
router.get('/overview', dashboardController.getDashboardOverview);

module.exports = router; 