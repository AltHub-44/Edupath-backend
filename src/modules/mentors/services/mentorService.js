const { Op } = require('sequelize');
const User = require('../../../models/userModel');
const MentorProfile = require('../../../models/mentorProfile');
const MentorMentee = require('../../../models/mentorMentee');
const Schedule = require('../../../models/schedule');
const Assignment = require('../../../models/assignment');
const Message = require('../../../models/message');
const Resource = require('../../../models/resource');
const ResourceAssignment = require('../../../models/resourceAssignment');
const Notification = require('../../../models/notification');
const ActivityLog = require('../../../models/activityLog');
const AssignmentSubmission = require('../../../models/assignmentSubmission');
const MessageAttachment = require('../../../models/messageAttachment');
const { error } = require('../../../utils/helpers');
const sequelize = require('sequelize');

// Enhanced Dashboard Overview
exports.getDashboardOverview = async (mentorId) => {
  try {
    const [
      totalMentees,
      activeSessions,
      pendingAssignments,
      recentActivities,
      upcomingSessions
    ] = await Promise.all([
      MentorMentee.count({ where: { mentorId, status: 'active' } }),
      Schedule.count({
        where: {
          mentorId,
          status: 'booked',
          startTime: { [Op.gt]: new Date() }
        }
      }),
      Assignment.count({
        where: {
          mentorId,
          status: 'pending'
        }
      }),
      ActivityLog.findAll({
        where: { userId: mentorId },
        order: [['createdAt', 'DESC']],
        limit: 5
      }),
      Schedule.findAll({
        where: {
          mentorId,
          status: 'booked',
          startTime: { [Op.gt]: new Date() }
        },
        order: [['startTime', 'ASC']],
        limit: 5,
        include: [{
          model: User,
          as: 'mentee',
          attributes: ['id', 'firstName', 'lastName']
        }]
      })
    ]);

    return {
      totalMentees,
      activeSessions,
      pendingAssignments,
      recentActivities,
      upcomingSessions
    };
  } catch (err) {
    error(err.statusCode || 500, err.message || 'Failed to fetch dashboard overview');
  }
};

// Enhanced Dashboard Analytics
exports.getDashboardAnalytics = async (mentorId) => {
  try {
    const [
      sessionStats,
      assignmentStats,
      menteeProgress,
      resourceUsage
    ] = await Promise.all([
      Schedule.findAll({
        where: { mentorId },
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['status']
      }),
      Assignment.findAll({
        where: { mentorId },
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['status']
      }),
      MentorMentee.findAll({
        where: { mentorId },
        attributes: ['progress', 'milestones'],
        include: [{
          model: User,
          as: 'mentee',
          attributes: ['id', 'firstName', 'lastName']
        }]
      }),
      ResourceAssignment.findAll({
        where: { mentorId },
        attributes: [
          'resourceId',
          [sequelize.fn('COUNT', sequelize.col('id')), 'usageCount']
        ],
        group: ['resourceId'],
        include: [{
          model: Resource,
          attributes: ['id', 'title', 'type']
        }]
      })
    ]);

    return {
      sessionStats,
      assignmentStats,
      menteeProgress,
      resourceUsage
    };
  } catch (err) {
    error(err.statusCode || 500, err.message || 'Failed to fetch dashboard analytics');
  }
};

// Enhanced Mentee Management
exports.getMentees = async (mentorId, filters = {}) => {
  try {
    const whereClause = { mentorId, ...filters };
    const mentees = await MentorMentee.findAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'mentee',
        attributes: ['id', 'firstName', 'lastName', 'email', 'isActive']
      }]
    });

    return mentees;
  } catch (err) {
    error(err.statusCode || 500, err.message || 'Failed to fetch mentees');
  }
};

// Enhanced Session Management
exports.getSessions = async (mentorId, filters = {}) => {
  try {
    const whereClause = { mentorId, ...filters };
    const sessions = await Schedule.findAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'mentee',
        attributes: ['id', 'firstName', 'lastName']
      }],
      order: [['startTime', 'DESC']]
    });

    return sessions;
  } catch (err) {
    error(err.statusCode || 500, err.message || 'Failed to fetch sessions');
  }
};

// Enhanced Assignment Management
exports.getAssignments = async (mentorId, filters = {}) => {
  try {
    const whereClause = { mentorId, ...filters };
    const assignments = await Assignment.findAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'mentee',
        attributes: ['id', 'firstName', 'lastName']
      }],
      order: [['dueDate', 'DESC']]
    });

    return assignments;
  } catch (err) {
    error(err.statusCode || 500, err.message || 'Failed to fetch assignments');
  }
};

// Enhanced Resource Management
exports.getResources = async (mentorId, filters = {}) => {
  try {
    const whereClause = { mentorId, ...filters };
    const resources = await Resource.findAll({
      where: whereClause,
      include: [{
        model: ResourceAssignment,
        attributes: ['menteeId'],
        include: [{
          model: User,
          as: 'mentee',
          attributes: ['id', 'firstName', 'lastName']
        }]
      }],
      order: [['createdAt', 'DESC']]
    });

    return resources;
  } catch (err) {
    error(err.statusCode || 500, err.message || 'Failed to fetch resources');
  }
};

// Enhanced Messaging
exports.getMessages = async (mentorId, filters = {}) => {
  try {
    const whereClause = { senderId: mentorId, ...filters };
    const messages = await Message.findAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'recipient',
        attributes: ['id', 'firstName', 'lastName']
      }],
      order: [['createdAt', 'DESC']]
    });

    return messages;
  } catch (err) {
    error(err.statusCode || 500, err.message || 'Failed to fetch messages');
  }
};

// Enhanced Profile Management
exports.getProfile = async (mentorId) => {
  try {
    const profile = await MentorProfile.findOne({
      where: { userId: mentorId },
      include: [{
        model: User,
        attributes: ['id', 'firstName', 'lastName', 'email', 'isActive']
      }]
    });

    if (!profile) {
      error(404, 'Profile not found');
    }

    return profile;
  } catch (err) {
    error(err.statusCode || 500, err.message || 'Failed to fetch profile');
  }
};

// Enhanced Settings Management
exports.getSettings = async (mentorId) => {
  try {
    const profile = await MentorProfile.findOne({
      where: { userId: mentorId },
      attributes: ['privacySettings', 'notificationSettings', 'availability']
    });

    if (!profile) {
      error(404, 'Settings not found');
    }

    return profile;
  } catch (err) {
    error(err.statusCode || 500, err.message || 'Failed to fetch settings');
  }
};

// Notifications Service
exports.getNotifications = async (mentorId) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: mentorId },
      order: [['createdAt', 'DESC']],
      limit: 10
    });
    return notifications;
  } catch (err) {
    error(err.statusCode || 500, err.message || 'Internal server error');
  }
};

// Activity Log Service
exports.getMenteeActivity = async (menteeId, mentorId) => {
  try {
    const activity = await ActivityLog.findAll({
      where: { userId: menteeId, mentorId },
      order: [['timestamp', 'DESC']],
      limit: 20
    });
    return activity;
  } catch (err) {
    error(err.statusCode || 500, err.message || 'Internal server error');
  }
};

// Assignment Submission Service
exports.getAssignmentSubmissions = async (assignmentId) => {
  try {
    const submissions = await AssignmentSubmission.findAll({
      where: { assignmentId },
      include: [{
        model: User,
        as: 'mentee',
        attributes: ['id', 'firstName', 'lastName']
      }]
    });
    return submissions;
  } catch (err) {
    error(err.statusCode || 500, err.message || 'Internal server error');
  }
};

// Message Attachment Service
exports.addMessageAttachment = async (messageId, attachmentData) => {
  try {
    const attachment = await MessageAttachment.create({
      messageId,
      ...attachmentData
    });
    return attachment;
  } catch (err) {
    error(err.statusCode || 500, err.message || 'Internal server error');
  }
};

// Resource Assignment Service
exports.assignResource = async (mentorId, menteeId, resourceId, dueDate, notes) => {
  try {
    const assignment = await ResourceAssignment.create({
      mentorId,
      menteeId,
      resourceId,
      dueDate,
      notes
    });
    return assignment;
  } catch (err) {
    error(err.statusCode || 500, err.message || 'Internal server error');
  }
}; 