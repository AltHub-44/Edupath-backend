const User = require('../../../models/userModel');
const MentorProfile = require('../../../models/mentorProfile');
const MentorMentee = require('../../../models/mentorMentee');
const Schedule = require('../../../models/schedule');
const Assignment = require('../../../models/assignment');
const Message = require('../../../models/message');
const Resource = require('../../../models/resource');
const ResourceAssignment = require('../../../models/resourceAssignment');
const { Op } = require('sequelize');
const Notification = require('../../../models/notification');
const ActivityLog = require('../../../models/activityLog');
const AssignmentSubmission = require('../../../models/assignmentSubmission');
const MessageAttachment = require('../../../models/messageAttachment');
const sequelize = require('sequelize');
const mentorService = require('../services/mentorService');
const { success, error } = require('../../../utils/helpers');

// Enhanced Dashboard Overview
exports.getDashboardOverview = async (req, res) => {
  try {
    const overview = await mentorService.getDashboardOverview(req.user.id);
    success(res, 200, 'Dashboard overview fetched successfully', overview);
  } catch (err) {
    error(res, err.statusCode || 500, err.message);
  }
};

// Enhanced Dashboard Analytics
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const analytics = await mentorService.getDashboardAnalytics(req.user.id);
    success(res, 200, 'Dashboard analytics fetched successfully', analytics);
  } catch (err) {
    error(res, err.statusCode || 500, err.message);
  }
};

// Enhanced Mentee Management
exports.getMentees = async (req, res) => {
  try {
    const mentees = await mentorService.getMentees(req.user.id, req.query);
    success(res, 200, 'Mentees fetched successfully', mentees);
  } catch (err) {
    error(res, err.statusCode || 500, err.message);
  }
};

exports.getMenteeProfile = async (req, res) => {
  try {
    const mentee = await mentorService.getMenteeProfile(req.params.menteeId);
    success(res, 200, 'Mentee profile fetched successfully', mentee);
  } catch (err) {
    error(res, err.statusCode || 500, err.message);
  }
};

exports.getMenteeProgress = async (req, res) => {
  try {
    const progress = await mentorService.getMenteeProgress(req.params.menteeId);
    success(res, 200, 'Mentee progress fetched successfully', progress);
  } catch (err) {
    error(res, err.statusCode || 500, err.message);
  }
};

exports.getMenteePerformance = async (req, res) => {
  try {
    const performance = await mentorService.getMenteePerformance(req.params.menteeId);
    success(res, 200, 'Mentee performance fetched successfully', performance);
  } catch (err) {
    error(res, err.statusCode || 500, err.message);
  }
};

// Enhanced Session Management
exports.getSessions = async (req, res) => {
  try {
    const sessions = await mentorService.getSessions(req.user.id, req.query);
    success(res, 200, 'Sessions fetched successfully', sessions);
  } catch (err) {
    error(res, err.statusCode || 500, err.message);
  }
};

exports.createSession = async (req, res) => {
  try {
    const session = await mentorService.createSession(req.user.id, req.body);
    success(res, 201, 'Session created successfully', session);
  } catch (err) {
    error(res, err.statusCode || 500, err.message);
  }
};

exports.updateSession = async (req, res) => {
  try {
    const session = await mentorService.updateSession(req.params.sessionId, req.body);
    success(res, 200, 'Session updated successfully', session);
  } catch (err) {
    error(res, err.statusCode || 500, err.message);
  }
};

exports.deleteSession = async (req, res) => {
  try {
    await mentorService.deleteSession(req.params.sessionId);
    success(res, 200, 'Session deleted successfully');
  } catch (err) {
    error(res, err.statusCode || 500, err.message);
  }
};

// Enhanced Assignment Management
exports.getAssignments = async (req, res) => {
  try {
    const assignments = await mentorService.getAssignments(req.user.id, req.query);
    success(res, 200, 'Assignments fetched successfully', assignments);
  } catch (err) {
    error(res, err.statusCode || 500, err.message);
  }
};

exports.createAssignment = async (req, res) => {
  try {
    const assignment = await mentorService.createAssignment(req.user.id, req.body);
    success(res, 201, 'Assignment created successfully', assignment);
  } catch (err) {
    error(res, err.statusCode || 500, err.message);
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const assignment = await mentorService.updateAssignment(req.params.assignmentId, req.body);
    success(res, 200, 'Assignment updated successfully', assignment);
  } catch (err) {
    error(res, err.statusCode || 500, err.message);
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    await mentorService.deleteAssignment(req.params.assignmentId);
    success(res, 200, 'Assignment deleted successfully');
  } catch (err) {
    error(res, err.statusCode || 500, err.message);
  }
};

// Enhanced Resource Management
exports.getResources = async (req, res) => {
  try {
    const resources = await mentorService.getResources(req.user.id, req.query);
    success(res, 200, 'Resources fetched successfully', resources);
  } catch (err) {
    error(res, err.statusCode || 500, err.message);
  }
};

exports.createResource = async (req, res) => {
  try {
    const resource = await mentorService.createResource(req.user.id, req.body);
    success(res, 201, 'Resource created successfully', resource);
  } catch (err) {
    error(res, err.statusCode || 500, err.message);
  }
};

exports.updateResource = async (req, res) => {
  try {
    const resource = await mentorService.updateResource(req.params.resourceId, req.body);
    success(res, 200, 'Resource updated successfully', resource);
  } catch (err) {
    error(res, err.statusCode || 500, err.message);
  }
};

exports.deleteResource = async (req, res) => {
  try {
    await mentorService.deleteResource(req.params.resourceId);
    success(res, 200, 'Resource deleted successfully');
  } catch (err) {
    error(res, err.statusCode || 500, err.message);
  }
};

// Enhanced Messaging
exports.getMessages = async (req, res) => {
  try {
    const messages = await mentorService.getMessages(req.user.id, req.query);
    success(res, 200, 'Messages fetched successfully', messages);
  } catch (err) {
    error(res, err.statusCode || 500, err.message);
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const message = await mentorService.sendMessage(req.user.id, req.body);
    success(res, 201, 'Message sent successfully', message);
  } catch (err) {
    error(res, err.statusCode || 500, err.message);
  }
};

// Enhanced Profile Management
exports.getProfile = async (req, res) => {
  try {
    const profile = await mentorService.getProfile(req.user.id);
    success(res, 200, 'Profile fetched successfully', profile);
  } catch (err) {
    error(res, err.statusCode || 500, err.message);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const profile = await mentorService.updateProfile(req.user.id, req.body);
    success(res, 200, 'Profile updated successfully', profile);
  } catch (err) {
    error(res, err.statusCode || 500, err.message);
  }
};

// Enhanced Settings Management
exports.getSettings = async (req, res) => {
  try {
    const settings = await mentorService.getSettings(req.user.id);
    success(res, 200, 'Settings fetched successfully', settings);
  } catch (err) {
    error(res, err.statusCode || 500, err.message);
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const settings = await mentorService.updateSettings(req.user.id, req.body);
    success(res, 200, 'Settings updated successfully', settings);
  } catch (err) {
    error(res, err.statusCode || 500, err.message);
  }
};

// My Mentees tab
exports.getMentees = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const filters = req.query;
    const mentees = await mentorService.getMentees(mentorId, filters);
    res.status(200).json({ success: true, data: mentees });
  } catch (err) {
    console.error('Get Mentees Error:', err);
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

exports.getMenteeProfile = async (req, res) => {
  try {
    const { menteeId } = req.params;
    const mentorId = req.user.id;

    const mentee = await MentorMentee.findOne({
      where: { mentorId, menteeId },
      include: [{
        model: User,
        as: 'mentee',
        attributes: ['id', 'firstName', 'lastName', 'email', 'isActive']
      }]
    });

    if (!mentee) {
      return res.status(404).json({ message: 'Mentee not found' });
    }

    // Get mentee's assignments
    const assignments = await Assignment.findAll({
      where: { mentorId, menteeId },
      order: [['dueDate', 'DESC']]
    });

    // Get mentee's sessions
    const sessions = await Schedule.findAll({
      where: {
        mentorId,
        menteeId,
        status: { [Op.in]: ['booked', 'completed'] }
      },
      order: [['startTime', 'DESC']]
    });

    // Get mentee's resources
    const resources = await ResourceAssignment.findAll({
      where: { mentorId, menteeId },
      include: [{
        model: Resource,
        attributes: ['id', 'title', 'type', 'url']
      }]
    });

    res.json({
      ...mentee.toJSON(),
      assignments,
      sessions,
      resources
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Schedule tab
exports.getSchedule = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const filters = req.query;
    const schedule = await mentorService.getSchedule(mentorId, filters);
    res.status(200).json({ success: true, data: schedule });
  } catch (err) {
    console.error('Get Schedule Error:', err);
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const { id, startTime, endTime, type, status, sessionType, isRecurring, recurrencePattern } = req.body;

    if (id) {
      const schedule = await Schedule.findOne({
        where: { id, mentorId }
      });

      if (!schedule) {
        return res.status(404).json({ message: 'Schedule not found' });
      }

      await schedule.update({
        startTime,
        endTime,
        type,
        status,
        sessionType,
        isRecurring,
        recurrencePattern
      });
      res.json(schedule);
    } else {
      const schedule = await Schedule.create({
        mentorId,
        startTime,
        endTime,
        type,
        status,
        sessionType,
        isRecurring,
        recurrencePattern
      });
      res.status(201).json(schedule);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assignment tab
exports.gradeAssignment = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const { assignmentId } = req.params;
    const { grade, feedback, rubricScores } = req.body;

    const assignment = await Assignment.findOne({
      where: { id: assignmentId, mentorId }
    });

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    await assignment.update({
      grade,
      feedback,
      status: 'reviewed',
      gradingCriteria: rubricScores
    });

    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Resources tab
exports.assignResource = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const { menteeId, resourceId, dueDate, notes } = req.body;

    const assignment = await ResourceAssignment.create({
      mentorId,
      menteeId,
      resourceId,
      dueDate,
      notes
    });

    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Messages tab
exports.getMessageThreads = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const threads = await Message.findAll({
      where: { mentorId },
      attributes: ['threadId'],
      group: ['threadId'],
      include: [{
        model: User,
        as: 'mentee',
        attributes: ['id', 'firstName', 'lastName']
      }]
    });
    res.json(threads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Message Attachments
exports.addMessageAttachment = async (req, res) => {
  try {
    const { messageId } = req.params;
    const attachment = await MessageAttachment.create({
      messageId,
      ...req.body
    });
    res.status(201).json(attachment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark Message as Read
exports.markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    await Message.update(
      { isRead: true },
      { where: { id: messageId } }
    );
    res.json({ message: 'Message marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Availability
exports.getAvailability = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const availability = await MentorProfile.findOne({
      where: { userId: mentorId },
      attributes: ['availability']
    });
    res.json(availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAvailability = async (req, res) => {
  try {
    const mentorId = req.user.id;
    await MentorProfile.update(
      { availability: req.body.availability },
      { where: { userId: mentorId } }
    );
    res.json({ message: 'Availability updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Notification Settings
exports.getNotificationSettings = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const settings = await MentorProfile.findOne({
      where: { userId: mentorId },
      attributes: ['notificationSettings']
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateNotificationSettings = async (req, res) => {
  try {
    const mentorId = req.user.id;
    await MentorProfile.update(
      { notificationSettings: req.body.settings },
      { where: { userId: mentorId } }
    );
    res.json({ message: 'Notification settings updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Integration Settings
exports.getIntegrationSettings = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const settings = await MentorProfile.findOne({
      where: { userId: mentorId },
      attributes: ['integrationSettings']
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateIntegrationSettings = async (req, res) => {
  try {
    const mentorId = req.user.id;
    await MentorProfile.update(
      { integrationSettings: req.body.settings },
      { where: { userId: mentorId } }
    );
    res.json({ message: 'Integration settings updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mentee Activity
exports.getMenteeActivity = async (req, res) => {
  try {
    const { menteeId } = req.params;
    const mentorId = req.user.id;

    const activity = await ActivityLog.findAll({
      where: { userId: menteeId, mentorId },
      order: [['timestamp', 'DESC']],
      limit: 20
    });

    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Schedule Conflicts
exports.checkScheduleConflicts = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const { startTime, endTime } = req.query;

    const conflicts = await Schedule.findAll({
      where: {
        mentorId,
        [Op.or]: [
          {
            startTime: { [Op.between]: [startTime, endTime] }
          },
          {
            endTime: { [Op.between]: [startTime, endTime] }
          }
        ]
      }
    });

    res.json(conflicts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Calendar Events
exports.getCalendarEvents = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const { startDate, endDate } = req.query;

    const events = await Schedule.findAll({
      where: {
        mentorId,
        startTime: { [Op.between]: [startDate, endDate] }
      },
      include: [{
        model: User,
        as: 'mentee',
        attributes: ['id', 'firstName', 'lastName']
      }]
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assignment Stats
exports.getAssignmentStats = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const stats = await Assignment.findAll({
      where: { mentorId },
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assignment Submissions
exports.getAssignmentSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const submissions = await AssignmentSubmission.findAll({
      where: { assignmentId },
      include: [{
        model: User,
        as: 'mentee',
        attributes: ['id', 'firstName', 'lastName']
      }]
    });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Resource Categories
exports.getResourceCategories = async (req, res) => {
  try {
    const categories = await Resource.findAll({
      attributes: ['category'],
      group: ['category']
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Resource Analytics
exports.getResourceAnalytics = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const analytics = await Resource.findAll({
      where: { mentorId },
      attributes: [
        'id',
        'title',
        'views',
        'downloads',
        'createdAt'
      ]
    });
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 