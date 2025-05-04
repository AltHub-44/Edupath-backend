const User = require('../../../models/userModel');
const StudentMentor = require('../../../models/mentorModel');
const Session = require('../../../models/sessionModel');
const Progress = require('../../../models/progressModel');
const Message = require('../../../models/messageModel');
const { error } = require('../../../utils/helpers');

const getAllMentees = async (mentorId) => {
    try {
        const mentees = await StudentMentor.findAll({
            where: { mentorId },
            include: [{
                model: User,
                as: 'student',
                attributes: ['id', 'firstName', 'lastName', 'email', 'profilePicture']
            }]
        });

        return mentees.map(mentee => ({
            id: mentee.student.id,
            name: `${mentee.student.firstName} ${mentee.student.lastName}`,
            email: mentee.student.email,
            profilePicture: mentee.student.profilePicture,
            status: mentee.status,
            joinedDate: mentee.createdAt
        }));
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
};

const getMenteeDetails = async (mentorId, menteeId) => {
    try {
        // Verify the mentor-mentee relationship
        const relationship = await StudentMentor.findOne({
            where: { mentorId, studentId: menteeId }
        });

        if (!relationship) {
            error(404, 'Mentee not found or not associated with this mentor');
        }

        // Get mentee details
        const mentee = await User.findOne({
            where: { id: menteeId },
            attributes: ['id', 'firstName', 'lastName', 'email', 'profilePicture', 'bio']
        });

        // Get recent sessions
        const recentSessions = await Session.findAll({
            where: { mentorId, studentId: menteeId },
            limit: 5,
            order: [['date', 'DESC']]
        });

        // Get progress summary
        const progress = await Progress.findOne({
            where: { studentId: menteeId },
            order: [['createdAt', 'DESC']]
        });

        return {
            profile: {
                id: mentee.id,
                name: `${mentee.firstName} ${mentee.lastName}`,
                email: mentee.email,
                profilePicture: mentee.profilePicture,
                bio: mentee.bio
            },
            relationship: {
                status: relationship.status,
                joinedDate: relationship.createdAt
            },
            recentSessions: recentSessions.map(session => ({
                id: session.id,
                date: session.date,
                status: session.status,
                notes: session.notes
            })),
            progress: progress ? {
                lastUpdated: progress.createdAt,
                milestones: progress.milestones,
                achievements: progress.achievements
            } : null
        };
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
};

const getMenteeProgress = async (mentorId, menteeId) => {
    try {
        // Verify the mentor-mentee relationship
        const relationship = await StudentMentor.findOne({
            where: { mentorId, studentId: menteeId }
        });

        if (!relationship) {
            error(404, 'Mentee not found or not associated with this mentor');
        }

        // Get all progress records
        const progressRecords = await Progress.findAll({
            where: { studentId: menteeId },
            order: [['createdAt', 'DESC']]
        });

        return progressRecords.map(record => ({
            id: record.id,
            date: record.createdAt,
            milestones: record.milestones,
            achievements: record.achievements,
            notes: record.notes
        }));
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
};

const getMenteeSessions = async (mentorId, menteeId) => {
    try {
        // Verify the mentor-mentee relationship
        const relationship = await StudentMentor.findOne({
            where: { mentorId, studentId: menteeId }
        });

        if (!relationship) {
            error(404, 'Mentee not found or not associated with this mentor');
        }

        // Get all sessions
        const sessions = await Session.findAll({
            where: { mentorId, studentId: menteeId },
            order: [['date', 'DESC']]
        });

        return sessions.map(session => ({
            id: session.id,
            date: session.date,
            status: session.status,
            notes: session.notes,
            duration: session.duration,
            type: session.type
        }));
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
};

const scheduleSession = async (mentorId, menteeId, sessionData) => {
    try {
        // Verify the mentor-mentee relationship
        const relationship = await StudentMentor.findOne({
            where: { mentorId, studentId: menteeId }
        });

        if (!relationship) {
            error(404, 'Mentee not found or not associated with this mentor');
        }

        // Create new session
        const session = await Session.create({
            mentorId,
            studentId: menteeId,
            date: sessionData.date,
            duration: sessionData.duration,
            type: sessionData.type,
            notes: sessionData.notes,
            status: 'scheduled'
        });

        return session;
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
};

const updateSession = async (mentorId, menteeId, sessionId, updateData) => {
    try {
        // Verify the mentor-mentee relationship
        const relationship = await StudentMentor.findOne({
            where: { mentorId, studentId: menteeId }
        });

        if (!relationship) {
            error(404, 'Mentee not found or not associated with this mentor');
        }

        // Update session
        const [updated] = await Session.update(updateData, {
            where: { id: sessionId, mentorId, studentId: menteeId }
        });

        if (!updated) {
            error(404, 'Session not found');
        }

        return await Session.findByPk(sessionId);
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
};

const addProgressUpdate = async (mentorId, menteeId, progressData) => {
    try {
        // Verify the mentor-mentee relationship
        const relationship = await StudentMentor.findOne({
            where: { mentorId, studentId: menteeId }
        });

        if (!relationship) {
            error(404, 'Mentee not found or not associated with this mentor');
        }

        // Create new progress record
        const progress = await Progress.create({
            studentId: menteeId,
            mentorId,
            milestones: progressData.milestones,
            achievements: progressData.achievements,
            notes: progressData.notes
        });

        return progress;
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
};

const sendMessage = async (mentorId, menteeId, content) => {
    try {
        // Verify the mentor-mentee relationship
        const relationship = await StudentMentor.findOne({
            where: { mentorId, studentId: menteeId }
        });

        if (!relationship) {
            error(404, 'Mentee not found or not associated with this mentor');
        }

        // Create new message
        const message = await Message.create({
            senderId: mentorId,
            receiverId: menteeId,
            content,
            senderType: 'mentor'
        });

        return message;
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
};

const getMessages = async (mentorId, menteeId) => {
    try {
        // Verify the mentor-mentee relationship
        const relationship = await StudentMentor.findOne({
            where: { mentorId, studentId: menteeId }
        });

        if (!relationship) {
            error(404, 'Mentee not found or not associated with this mentor');
        }

        // Get all messages between mentor and mentee
        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderId: mentorId, receiverId: menteeId },
                    { senderId: menteeId, receiverId: mentorId }
                ]
            },
            order: [['createdAt', 'ASC']]
        });

        return messages;
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
};

module.exports = {
    getAllMentees,
    getMenteeDetails,
    getMenteeProgress,
    getMenteeSessions,
    scheduleSession,
    updateSession,
    addProgressUpdate,
    sendMessage,
    getMessages
}; 