const User = require('../../../models/userModel');
const StudentMentor = require('../../../models/mentorModel');
const Session = require('../../../models/sessionModel');
const { error } = require('../../../utils/helpers');
const { Op } = require('sequelize');

const getDashboardOverview = async (mentorId) => {
    try {
        // Get mentor profile with more details
        const mentorProfile = await User.findOne({
            where: { id: mentorId },
            attributes: ['firstName', 'lastName', 'email', 'profilePicture', 'role']
        });

        // Get mentee statistics
        const totalMentees = await StudentMentor.count({
            where: { mentorId }
        });

        const activeMentees = await StudentMentor.count({
            where: { 
                mentorId,
                status: 'active'
            }
        });

        // Get recent mentees with more details
        const recentMentees = await StudentMentor.findAll({
            where: { mentorId },
            include: [{
                model: User,
                as: 'student',
                attributes: ['firstName', 'lastName', 'email', 'profilePicture']
            }],
            limit: 5,
            order: [['createdAt', 'DESC']]
        });

        // Get upcoming sessions
        const upcomingSessions = await Session.findAll({
            where: {
                mentorId,
                status: 'scheduled',
                date: {
                    [Op.gte]: new Date()
                }
            },
            include: [{
                model: User,
                as: 'student',
                attributes: ['firstName', 'lastName', 'email']
            }],
            limit: 3,
            order: [['date', 'ASC']]
        });

        // Get recent activities (last 5)
        const recentActivities = await Session.findAll({
            where: {
                mentorId,
                status: 'completed'
            },
            include: [{
                model: User,
                as: 'student',
                attributes: ['firstName', 'lastName']
            }],
            limit: 5,
            order: [['date', 'DESC']]
        });

        return {
            profile: {
                name: `${mentorProfile.firstName} ${mentorProfile.lastName}`,
                email: mentorProfile.email,
                profilePicture: mentorProfile.profilePicture,
                role: mentorProfile.role
            },
            stats: {
                totalMentees,
                activeMentees,
                completedSessions: await Session.count({
                    where: {
                        mentorId,
                        status: 'completed'
                    }
                }),
                upcomingSessions: await Session.count({
                    where: {
                        mentorId,
                        status: 'scheduled',
                        date: {
                            [Op.gte]: new Date()
                        }
                    }
                })
            },
            recentMentees: recentMentees.map(mentee => ({
                id: mentee.student.id,
                name: `${mentee.student.firstName} ${mentee.student.lastName}`,
                email: mentee.student.email,
                profilePicture: mentee.student.profilePicture
            })),
            upcomingSessions: upcomingSessions.map(session => ({
                id: session.id,
                date: session.date,
                student: {
                    name: `${session.student.firstName} ${session.student.lastName}`,
                    email: session.student.email
                },
                status: session.status
            })),
            recentActivities: recentActivities.map(activity => ({
                id: activity.id,
                date: activity.date,
                student: {
                    name: `${activity.student.firstName} ${activity.student.lastName}`
                },
                status: activity.status
            }))
        };
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
};

module.exports = {
    getDashboardOverview
}; 