const Assignment = require('../../../models/assignmentModel');
const AssignmentTemplate = require('../../../models/assignmentTemplateModel');
const User = require('../../../models/userModel');
const { error } = require('../../../utils/helpers');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

const createAssignment = async (mentorId, assignmentData) => {
    try {
        // Verify the mentor-student relationship
        const relationship = await StudentMentor.findOne({
            where: { mentorId, studentId: assignmentData.studentId }
        });

        if (!relationship) {
            error(404, 'Student not found or not assigned to this mentor');
        }

        const assignment = await Assignment.create({
            ...assignmentData,
            mentorId,
            status: 'pending'
        });

        return assignment;
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
};

const getAssignments = async (mentorId, filters = {}) => {
    try {
        const assignments = await Assignment.findAll({
            where: { mentorId, ...filters },
            include: [{
                model: User,
                as: 'student',
                attributes: ['id', 'firstName', 'lastName', 'email']
            }],
            order: [['dueDate', 'ASC']]
        });

        return assignments;
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
};

const getAssignmentById = async (mentorId, assignmentId) => {
    try {
        const assignment = await Assignment.findOne({
            where: { id: assignmentId, mentorId },
            include: [{
                model: User,
                as: 'student',
                attributes: ['id', 'firstName', 'lastName', 'email']
            }]
        });

        if (!assignment) {
            error(404, 'Assignment not found');
        }

        return assignment;
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
};

const updateAssignment = async (mentorId, assignmentId, updateData) => {
    try {
        const assignment = await Assignment.findOne({
            where: { id: assignmentId, mentorId }
        });

        if (!assignment) {
            error(404, 'Assignment not found');
        }

        await assignment.update(updateData);
        return assignment;
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
};

const deleteAssignment = async (mentorId, assignmentId) => {
    try {
        const assignment = await Assignment.findOne({
            where: { id: assignmentId, mentorId }
        });

        if (!assignment) {
            error(404, 'Assignment not found');
        }

        await assignment.destroy();
        return { message: 'Assignment deleted successfully' };
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
};

const gradeAssignment = async (mentorId, assignmentId, gradeData) => {
    try {
        const assignment = await Assignment.findOne({
            where: { id: assignmentId, mentorId }
        });

        if (!assignment) {
            error(404, 'Assignment not found');
        }

        if (assignment.status !== 'submitted') {
            error(400, 'Assignment must be submitted before grading');
        }

        await assignment.update({
            grade: gradeData.grade,
            feedback: gradeData.feedback,
            status: 'graded'
        });

        return assignment;
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
};

const getStudentAssignments = async (mentorId, studentId) => {
    try {
        const assignments = await Assignment.findAll({
            where: { mentorId, studentId },
            order: [['dueDate', 'ASC']]
        });

        return assignments;
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
};

const createBulkAssignments = async (mentorId, assignmentData) => {
    try {
        const { studentIds, ...commonData } = assignmentData;
        
        // Verify all students are assigned to this mentor
        const relationships = await StudentMentor.findAll({
            where: { 
                mentorId,
                studentId: { [Op.in]: studentIds }
            }
        });

        if (relationships.length !== studentIds.length) {
            error(404, 'One or more students not found or not assigned to this mentor');
        }

        const assignments = await Promise.all(
            studentIds.map(studentId => 
                Assignment.create({
                    ...commonData,
                    mentorId,
                    studentId
                })
            )
        );

        return assignments;
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
};

const getAssignmentStatistics = async (mentorId) => {
    try {
        const assignments = await Assignment.findAll({
            where: { mentorId },
            attributes: [
                'status',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['status']
        });

        const totalAssignments = await Assignment.count({ where: { mentorId } });
        const gradedAssignments = await Assignment.count({ 
            where: { 
                mentorId,
                status: 'graded'
            }
        });

        const averageGrade = await Assignment.findOne({
            where: { 
                mentorId,
                status: 'graded'
            },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('grade')), 'average']
            ]
        });

        return {
            statusDistribution: assignments,
            totalAssignments,
            gradedAssignments,
            averageGrade: averageGrade ? averageGrade.getDataValue('average') : 0
        };
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
};

const createAssignmentFromTemplate = async (mentorId, templateId, assignmentData) => {
    try {
        const template = await AssignmentTemplate.findOne({
            where: { id: templateId, mentorId }
        });

        if (!template) {
            error(404, 'Assignment template not found');
        }

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + (template.defaultDuration || 7));

        const assignment = await Assignment.create({
            ...template.toJSON(),
            ...assignmentData,
            mentorId,
            templateId,
            dueDate: assignmentData.dueDate || dueDate
        });

        return assignment;
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
};

module.exports = {
    createAssignment,
    getAssignments,
    getAssignmentById,
    updateAssignment,
    deleteAssignment,
    gradeAssignment,
    getStudentAssignments,
    createBulkAssignments,
    getAssignmentStatistics,
    createAssignmentFromTemplate
}; 