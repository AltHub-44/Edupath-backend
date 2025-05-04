const express = require('express');
const router = express.Router();
const mentorDashboardRoutes = require('../modules/mentor/routes/dashboardRoutes');
const mentorMenteeRoutes = require('../modules/mentor/routes/menteeRoutes');
const mentorSessionRoutes = require('../modules/mentor/routes/sessionRoutes');
const mentorAssignmentRoutes = require('../modules/mentor/routes/assignmentRoutes');
const mentorResourceRoutes = require('../modules/mentor/routes/resourceRoutes');
const mentorCalendarRoutes = require('../modules/mentor/routes/calendarRoutes');

// Mentor Dashboard Routes
router.use('/api/mentor/dashboard', mentorDashboardRoutes);

// Mentor Mentee Management Routes
router.use('/api/mentor/mentees', mentorMenteeRoutes);

// Mentor Session Management Routes
router.use('/api/mentor/sessions', mentorSessionRoutes);

// Mentor Assignment Management Routes
router.use('/api/mentor/assignments', mentorAssignmentRoutes);

// Mentor Resource Management Routes
router.use('/api/mentor/resources', mentorResourceRoutes);

// Mentor Calendar Management Routes
router.use('/api/mentor/calendar', mentorCalendarRoutes);

module.exports = router; 