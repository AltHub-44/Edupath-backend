const Assignment = require('../../../models/assignmentModel');
const { Op } = require('sequelize');

// Create a new assignment
const createAssignment = async (req, res) => {
    try {
        const { studentId, title, description, dueDate, attachments = [] } = req.body;
        const mentorId = req.user.id;

        const assignment = await Assignment.create({
            mentorId,
            studentId,
            title,
            description,
            dueDate,
            attachments
        });

        res.status(201).json(assignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all assignments for a mentor
const getMentorAssignments = async (req, res) => {
    try {
        const mentorId = req.user.id;
        const assignments = await Assignment.findAll({
            where: { mentorId },
            order: [['createdAt', 'DESC']]
        });

        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all assignments for a student
const getStudentAssignments = async (req, res) => {
    try {
        const studentId = req.user.id;
        const assignments = await Assignment.findAll({
            where: { studentId },
            order: [['dueDate', 'ASC']]
        });

        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Submit an assignment
const submitAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const { content, attachments = [] } = req.body;
        const studentId = req.user.id;

        const assignment = await Assignment.findByPk(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        if (assignment.studentId !== studentId) {
            return res.status(403).json({ message: 'Not authorized to submit this assignment' });
        }

        assignment.submission = {
            content,
            attachments,
            submittedAt: new Date()
        };
        assignment.status = 'submitted';
        await assignment.save();

        res.json(assignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Grade an assignment
const gradeAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const { grade, feedback } = req.body;
        const mentorId = req.user.id;

        const assignment = await Assignment.findByPk(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        if (assignment.mentorId !== mentorId) {
            return res.status(403).json({ message: 'Not authorized to grade this assignment' });
        }

        assignment.grade = grade;
        assignment.feedback = feedback;
        assignment.status = 'graded';
        await assignment.save();

        res.json(assignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createAssignment,
    getMentorAssignments,
    getStudentAssignments,
    submitAssignment,
    gradeAssignment
}; 