const express = require('express');
const router = express.Router();
const mentorController = require('../controllers/mentorController');
const { authenticate, authorize } = require('../../../middleware/auth');
const { validateSession, validateAssignment, validateResource, validateMessage, validateProfile, validateSettings, validatePagination, validateId, validateFileUpload } = require('../../../middleware/validation');
const { apiLimiter, uploadLimiter, messageLimiter, sessionLimiter } = require('../../../middleware/rateLimit');
const { cacheMiddleware, CACHE_KEYS } = require('../../../utils/cache');

// Apply general rate limiting to all routes
router.use(apiLimiter);

// Dashboard Overview & Analytics
router.get('/dashboard/overview', 
  authenticate, 
  authorize(['mentor']), 
  cacheMiddleware(CACHE_KEYS.DASHBOARD_OVERVIEW),
  mentorController.getDashboardOverview
);

router.get('/dashboard/analytics', 
  authenticate, 
  authorize(['mentor']), 
  cacheMiddleware(CACHE_KEYS.DASHBOARD_ANALYTICS),
  mentorController.getDashboardAnalytics
);

// Mentee Management
router.get('/mentees', 
  authenticate, 
  authorize(['mentor']), 
  validatePagination,
  cacheMiddleware(CACHE_KEYS.MENTEE_LIST),
  mentorController.getMentees
);

router.get('/mentees/:menteeId/profile', 
  authenticate, 
  authorize(['mentor']), 
  validateId,
  mentorController.getMenteeProfile
);

router.get('/mentees/:menteeId/progress', 
  authenticate, 
  authorize(['mentor']), 
  validateId,
  mentorController.getMenteeProgress
);

router.get('/mentees/:menteeId/performance', 
  authenticate, 
  authorize(['mentor']), 
  validateId,
  mentorController.getMenteePerformance
);

router.get('/mentees/:menteeId/activity', 
  authenticate, 
  authorize(['mentor']), 
  validateId,
  mentorController.getMenteeActivity
);

// Session Management
router.get('/sessions', 
  authenticate, 
  authorize(['mentor']), 
  validatePagination,
  cacheMiddleware(CACHE_KEYS.SESSION_LIST),
  mentorController.getSessions
);

router.post('/sessions', 
  authenticate, 
  authorize(['mentor']), 
  sessionLimiter,
  validateSession,
  mentorController.createSession
);

router.put('/sessions/:sessionId', 
  authenticate, 
  authorize(['mentor']), 
  validateId,
  validateSession,
  mentorController.updateSession
);

router.delete('/sessions/:sessionId', 
  authenticate, 
  authorize(['mentor']), 
  validateId,
  mentorController.deleteSession
);

router.get('/sessions/calendar', 
  authenticate, 
  authorize(['mentor']), 
  mentorController.getCalendarEvents
);

router.get('/sessions/conflicts', 
  authenticate, 
  authorize(['mentor']), 
  mentorController.checkScheduleConflicts
);

// Assignment Management
router.get('/assignments', 
  authenticate, 
  authorize(['mentor']), 
  validatePagination,
  cacheMiddleware(CACHE_KEYS.ASSIGNMENT_LIST),
  mentorController.getAssignments
);

router.post('/assignments', 
  authenticate, 
  authorize(['mentor']), 
  validateAssignment,
  mentorController.createAssignment
);

router.put('/assignments/:assignmentId', 
  authenticate, 
  authorize(['mentor']), 
  validateId,
  validateAssignment,
  mentorController.updateAssignment
);

router.delete('/assignments/:assignmentId', 
  authenticate, 
  authorize(['mentor']), 
  validateId,
  mentorController.deleteAssignment
);

router.get('/assignments/stats', 
  authenticate, 
  authorize(['mentor']), 
  mentorController.getAssignmentStats
);

router.get('/assignments/:assignmentId/submissions', 
  authenticate, 
  authorize(['mentor']), 
  validateId,
  mentorController.getAssignmentSubmissions
);

router.post('/assignments/:assignmentId/grade', 
  authenticate, 
  authorize(['mentor']), 
  validateId,
  mentorController.gradeAssignment
);

// Resource Management
router.get('/resources', 
  authenticate, 
  authorize(['mentor']), 
  validatePagination,
  cacheMiddleware(CACHE_KEYS.RESOURCE_LIST),
  mentorController.getResources
);

router.post('/resources', 
  authenticate, 
  authorize(['mentor']), 
  uploadLimiter,
  validateResource,
  mentorController.createResource
);

router.put('/resources/:resourceId', 
  authenticate, 
  authorize(['mentor']), 
  validateId,
  validateResource,
  mentorController.updateResource
);

router.delete('/resources/:resourceId', 
  authenticate, 
  authorize(['mentor']), 
  validateId,
  mentorController.deleteResource
);

router.get('/resources/categories', 
  authenticate, 
  authorize(['mentor']), 
  mentorController.getResourceCategories
);

router.get('/resources/analytics', 
  authenticate, 
  authorize(['mentor']), 
  mentorController.getResourceAnalytics
);

router.post('/resources/:resourceId/assign', 
  authenticate, 
  authorize(['mentor']), 
  validateId,
  mentorController.assignResource
);

// Messaging
router.get('/messages', 
  authenticate, 
  authorize(['mentor']), 
  validatePagination,
  mentorController.getMessages
);

router.post('/messages', 
  authenticate, 
  authorize(['mentor']), 
  messageLimiter,
  validateMessage,
  mentorController.sendMessage
);

router.get('/messages/threads', 
  authenticate, 
  authorize(['mentor']), 
  mentorController.getMessageThreads
);

// Profile Management
router.get('/profile', 
  authenticate, 
  authorize(['mentor']), 
  mentorController.getProfile
);

router.put('/profile', 
  authenticate, 
  authorize(['mentor']), 
  validateProfile,
  mentorController.updateProfile
);

// Settings Management
router.get('/settings', 
  authenticate, 
  authorize(['mentor']), 
  mentorController.getSettings
);

router.put('/settings', 
  authenticate, 
  authorize(['mentor']), 
  validateSettings,
  mentorController.updateSettings
);

// File Upload
router.post('/upload', 
  authenticate, 
  authorize(['mentor']), 
  uploadLimiter,
  validateFileUpload,
  mentorController.uploadFile
);

// Notifications
router.get('/notifications', 
  authenticate, 
  authorize(['mentor']), 
  mentorController.getNotifications
);

router.put('/notifications/:id/read', 
  authenticate, 
  authorize(['mentor']), 
  validateId,
  mentorController.markNotificationAsRead
);

module.exports = router; 