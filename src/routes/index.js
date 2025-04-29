const express = require('express');
const router = express.Router();
const mentorDashboardRoutes = require('../modules/mentor/routes/dashboardRoutes');
const mentorMenteeRoutes = require('../modules/mentor/routes/menteeRoutes');
const mentorSessionRoutes = require('../modules/mentor/routes/sessionRoutes');
const mentorAssignmentRoutes = require('../modules/mentor/routes/assignmentRoutes');

// Mentor Dashboard Routes
router.use('/api/mentor/dashboard', mentorDashboardRoutes);

// Mentor Mentee Management Routes
router.use('/api/mentor/mentees', mentorMenteeRoutes);

// Mentor Session Management Routes
router.use('/api/mentor/sessions', mentorSessionRoutes);

// Mentor Assignment Management Routes
router.use('/api/mentor/assignments', mentorAssignmentRoutes);

module.exports = router; 