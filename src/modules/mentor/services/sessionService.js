const Session = require('../../../models/sessionModel');
const User = require('../../../models/userModel');
const SessionTemplate = require('../../../models/sessionTemplateModel');
const { Op } = require('sequelize');
const { error } = require('../../../utils/helpers');

const getCalendar = async (mentorId, startDate, endDate) => {
    try {
        const sessions = await Session.findAll({
            where: {
                mentorId,
                date: {
                    [Op.between]: [startDate, endDate]
                }
            },
            include: [{
                model: User,
                as: 'student',
                attributes: ['id', 'firstName', 'lastName', 'email']
            }],
            order: [['date', 'ASC']]
        });

        return sessions.map(session => ({
            id: session.id,
            title: `${session.student.firstName} ${session.student.lastName}`,
            start: session.date,
            end: new Date(session.date.getTime() + session.duration * 60000),
            student: {
                id: session.student.id,
                name: `${session.student.firstName} ${session.student.lastName}`,
                email: session.student.email
            },
            status: session.status,
            type: session.type,
            notes: session.notes
        }));
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
};

const scheduleSession = async (mentorId, studentId, sessionData) => {
    try {
        // Check if the student is assigned to this mentor
        const relationship = await StudentMentor.findOne({
            where: { mentorId, studentId }
        });

        if (!relationship) {
            error(404, 'Student not found or not assigned to this mentor');
        }

        // If using a template, load template data
        let templateData = {};
        if (sessionData.templateId) {
            const template = await SessionTemplate.findByPk(sessionData.templateId);
            if (!template) {
                error(404, 'Session template not found');
            }
            templateData = {
                objectives: template.objectives,
                materials: template.materials,
                followUpTasks: template.followUpTasks
            };
        }

        // Check for scheduling conflicts
        const conflictingSession = await Session.findOne({
            where: {
                mentorId,
                date: {
                    [Op.between]: [
                        new Date(sessionData.date),
                        new Date(sessionData.date.getTime() + sessionData.duration * 60000)
                    ]
                },
                status: {
                    [Op.notIn]: ['cancelled', 'completed']
                }
            }
        });

        if (conflictingSession) {
            error(400, 'There is a scheduling conflict with another session');
        }

        // Create the session
        const session = await Session.create({
            mentorId,
            studentId,
            date: sessionData.date,
            duration: sessionData.duration,
            type: sessionData.type,
            category: sessionData.category,
            notes: sessionData.notes,
            objectives: sessionData.objectives || templateData.objectives,
            materials: sessionData.materials || templateData.materials,
            followUpTasks: sessionData.followUpTasks || templateData.followUpTasks,
            isRecurring: sessionData.isRecurring || false,
            recurrencePattern: sessionData.recurrencePattern,
            timezone: sessionData.timezone,
            status: 'scheduled'
        });

        // If recurring, create future sessions
        if (sessionData.isRecurring && sessionData.recurrencePattern) {
            await createRecurringSessions(session, sessionData.recurrencePattern);
        }

        return session;
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
};

const createRecurringSessions = async (originalSession, recurrencePattern) => {
    try {
        const sessions = [];
        const { frequency, interval, endDate } = recurrencePattern;
        
        let currentDate = new Date(originalSession.date);
        while (currentDate <= new Date(endDate)) {
            if (currentDate > originalSession.date) {
                sessions.push({
                    mentorId: originalSession.mentorId,
                    studentId: originalSession.studentId,
                    date: new Date(currentDate),
                    duration: originalSession.duration,
                    type: originalSession.type,
                    category: originalSession.category,
                    objectives: originalSession.objectives,
                    materials: originalSession.materials,
                    followUpTasks: originalSession.followUpTasks,
                    isRecurring: true,
                    recurrencePattern,
                    timezone: originalSession.timezone,
                    status: 'scheduled'
                });
            }
            
            // Increment date based on frequency
            switch (frequency) {
                case 'daily':
                    currentDate.setDate(currentDate.getDate() + interval);
                    break;
                case 'weekly':
                    currentDate.setDate(currentDate.getDate() + (7 * interval));
                    break;
                case 'monthly':
                    currentDate.setMonth(currentDate.getMonth() + interval);
                    break;
            }
        }

        await Session.bulkCreate(sessions);
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
};

const updateSession = async (mentorId, sessionId, updateData) => {
    try {
        // Verify the session belongs to this mentor
        const session = await Session.findOne({
            where: { id: sessionId, mentorId }
        });

        if (!session) {
            error(404, 'Session not found');
        }

        // If updating date/duration, check for conflicts
        if (updateData.date || updateData.duration) {
            const newDate = updateData.date || session.date;
            const newDuration = updateData.duration || session.duration;

            const conflictingSession = await Session.findOne({
                where: {
                    mentorId,
                    id: { [Op.ne]: sessionId },
                    date: {
                        [Op.between]: [
                            newDate,
                            new Date(newDate.getTime() + newDuration * 60000)
                        ]
                    },
                    status: {
                        [Op.notIn]: ['cancelled', 'completed']
                    }
                }
            });

            if (conflictingSession) {
                error(400, 'There is a scheduling conflict with another session');
            }
        }

        // Update the session
        const [updated] = await Session.update(updateData, {
            where: { id: sessionId, mentorId }
        });

        if (!updated) {
            error(404, 'Failed to update session');
        }

        // If updating recurring session, update all future occurrences
        if (session.isRecurring && (updateData.date || updateData.duration)) {
            await updateRecurringSessions(session, updateData);
        }

        return await Session.findByPk(sessionId, {
            include: [{
                model: User,
                as: 'student',
                attributes: ['id', 'firstName', 'lastName', 'email']
            }]
        });
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
};

const updateRecurringSessions = async (originalSession, updateData) => {
    try {
        await Session.update(updateData, {
            where: {
                mentorId: originalSession.mentorId,
                studentId: originalSession.studentId,
                date: {
                    [Op.gt]: originalSession.date
                },
                isRecurring: true,
                status: 'scheduled'
            }
        });
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
};

const getSessionHistory = async (mentorId, page, limit) => {
    try {
        const offset = (page - 1) * limit;

        const { count, rows } = await Session.findAndCountAll({
            where: { mentorId },
            include: [{
                model: User,
                as: 'student',
                attributes: ['id', 'firstName', 'lastName', 'email']
            }],
            order: [['date', 'DESC']],
            limit: parseInt(limit),
            offset: offset
        });

        return {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            sessions: rows.map(session => ({
                id: session.id,
                date: session.date,
                student: {
                    id: session.student.id,
                    name: `${session.student.firstName} ${session.student.lastName}`,
                    email: session.student.email
                },
                status: session.status,
                type: session.type,
                notes: session.notes,
                duration: session.duration
            }))
        };
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
};

const getUpcomingSessions = async (mentorId) => {
    try {
        const sessions = await Session.findAll({
            where: {
                mentorId,
                date: {
                    [Op.gte]: new Date()
                },
                status: 'scheduled'
            },
            include: [{
                model: User,
                as: 'student',
                attributes: ['id', 'firstName', 'lastName', 'email']
            }],
            order: [['date', 'ASC']],
            limit: 5
        });

        return sessions.map(session => ({
            id: session.id,
            date: session.date,
            student: {
                id: session.student.id,
                name: `${session.student.firstName} ${session.student.lastName}`,
                email: session.student.email
            },
            type: session.type,
            duration: session.duration
        }));
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
};

const getSessionTemplates = async (mentorId) => {
    try {
        const templates = await SessionTemplate.findAll({
            where: { mentorId },
            attributes: ['id', 'name', 'type', 'category', 'objectives', 'materials', 'followUpTasks']
        });

        return templates;
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
};

const createSessionTemplate = async (mentorId, templateData) => {
    try {
        const template = await SessionTemplate.create({
            mentorId,
            name: templateData.name,
            type: templateData.type,
            category: templateData.category,
            objectives: templateData.objectives,
            materials: templateData.materials,
            followUpTasks: templateData.followUpTasks
        });

        return template;
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
};

module.exports = {
    getCalendar,
    scheduleSession,
    updateSession,
    getSessionHistory,
    getUpcomingSessions,
    getSessionTemplates,
    createSessionTemplate
}; 