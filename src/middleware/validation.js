const { body, param, query } = require('express-validator');
const { Op } = require('sequelize');

// Session validation
exports.validateSession = [
  body('startTime').isISO8601().withMessage('Invalid start time format'),
  body('endTime').isISO8601().withMessage('Invalid end time format'),
  body('menteeId').isInt().withMessage('Invalid mentee ID'),
  body('type').isIn(['one-on-one', 'group', 'workshop']).withMessage('Invalid session type'),
  body('status').isIn(['scheduled', 'completed', 'cancelled']).withMessage('Invalid status'),
  body('notes').optional().isString().withMessage('Notes must be a string'),
  body('isRecurring').optional().isBoolean().withMessage('isRecurring must be a boolean'),
  body('recurrencePattern').optional().isObject().withMessage('Invalid recurrence pattern')
];

// Assignment validation
exports.validateAssignment = [
  body('title').isString().notEmpty().withMessage('Title is required'),
  body('description').isString().notEmpty().withMessage('Description is required'),
  body('dueDate').isISO8601().withMessage('Invalid due date format'),
  body('menteeId').isInt().withMessage('Invalid mentee ID'),
  body('type').isIn(['homework', 'project', 'quiz', 'exam']).withMessage('Invalid assignment type'),
  body('points').isInt({ min: 0 }).withMessage('Points must be a positive integer'),
  body('instructions').optional().isString().withMessage('Instructions must be a string')
];

// Resource validation
exports.validateResource = [
  body('title').isString().notEmpty().withMessage('Title is required'),
  body('description').isString().notEmpty().withMessage('Description is required'),
  body('type').isIn(['document', 'video', 'link', 'file']).withMessage('Invalid resource type'),
  body('category').isString().notEmpty().withMessage('Category is required'),
  body('url').optional().isURL().withMessage('Invalid URL format'),
  body('file').optional().isObject().withMessage('Invalid file object')
];

// Message validation
exports.validateMessage = [
  body('recipientId').isInt().withMessage('Invalid recipient ID'),
  body('content').isString().notEmpty().withMessage('Message content is required'),
  body('threadId').optional().isInt().withMessage('Invalid thread ID'),
  body('attachments').optional().isArray().withMessage('Attachments must be an array')
];

// Profile validation
exports.validateProfile = [
  body('bio').optional().isString().withMessage('Bio must be a string'),
  body('expertise').isArray().withMessage('Expertise must be an array'),
  body('expertise.*').isString().withMessage('Each expertise item must be a string'),
  body('availability').isObject().withMessage('Availability must be an object'),
  body('preferredCommunication').isIn(['email', 'chat', 'video']).withMessage('Invalid communication preference')
];

// Settings validation
exports.validateSettings = [
  body('notificationSettings').isObject().withMessage('Notification settings must be an object'),
  body('privacySettings').isObject().withMessage('Privacy settings must be an object'),
  body('integrationSettings').optional().isObject().withMessage('Integration settings must be an object')
];

// Query parameter validation
exports.validatePagination = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

// ID parameter validation
exports.validateId = [
  param('id').isInt().withMessage('Invalid ID format')
];

// File upload validation
exports.validateFileUpload = [
  body('file').custom((value, { req }) => {
    if (!req.file) {
      throw new Error('File is required');
    }
    return true;
  }),
  body('type').isIn(['resource', 'assignment', 'profile']).withMessage('Invalid file type')
]; 