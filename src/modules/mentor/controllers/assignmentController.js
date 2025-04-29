const assignmentService = require('../services/assignmentService');

const createAssignment = async (req, res) => {
    try {
        const mentorId = req.user.id;
        const assignment = await assignmentService.createAssignment(mentorId, req.body);
        res.status(201).json({ success: true, data: assignment });
    } catch (err) {
        res.status(err.statusCode || 500).json({ 
            success: false, 
            message: err.message || 'Internal server error' 
        });
    }
};

const getAssignments = async (req, res) => {
    try {
        const mentorId = req.user.id;
        const filters = req.query;
        const assignments = await assignmentService.getAssignments(mentorId, filters);
        res.status(200).json({ success: true, data: assignments });
    } catch (err) {
        res.status(err.statusCode || 500).json({ 
            success: false, 
            message: err.message || 'Internal server error' 
        });
    }
};

const getAssignmentById = async (req, res) => {
    try {
        const mentorId = req.user.id;
        const { assignmentId } = req.params;
        const assignment = await assignmentService.getAssignmentById(mentorId, assignmentId);
        res.status(200).json({ success: true, data: assignment });
    } catch (err) {
        res.status(err.statusCode || 500).json({ 
            success: false, 
            message: err.message || 'Internal server error' 
        });
    }
};

const updateAssignment = async (req, res) => {
    try {
        const mentorId = req.user.id;
        const { assignmentId } = req.params;
        const assignment = await assignmentService.updateAssignment(mentorId, assignmentId, req.body);
        res.status(200).json({ success: true, data: assignment });
    } catch (err) {
        res.status(err.statusCode || 500).json({ 
            success: false, 
            message: err.message || 'Internal server error' 
        });
    }
};

const deleteAssignment = async (req, res) => {
    try {
        const mentorId = req.user.id;
        const { assignmentId } = req.params;
        const result = await assignmentService.deleteAssignment(mentorId, assignmentId);
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        res.status(err.statusCode || 500).json({ 
            success: false, 
            message: err.message || 'Internal server error' 
        });
    }
};

const gradeAssignment = async (req, res) => {
    try {
        const mentorId = req.user.id;
        const { assignmentId } = req.params;
        const assignment = await assignmentService.gradeAssignment(mentorId, assignmentId, req.body);
        res.status(200).json({ success: true, data: assignment });
    } catch (err) {
        res.status(err.statusCode || 500).json({ 
            success: false, 
            message: err.message || 'Internal server error' 
        });
    }
};

const getStudentAssignments = async (req, res) => {
    try {
        const mentorId = req.user.id;
        const { studentId } = req.params;
        const assignments = await assignmentService.getStudentAssignments(mentorId, studentId);
        res.status(200).json({ success: true, data: assignments });
    } catch (err) {
        res.status(err.statusCode || 500).json({ 
            success: false, 
            message: err.message || 'Internal server error' 
        });
    }
};

module.exports = {
    createAssignment,
    getAssignments,
    getAssignmentById,
    updateAssignment,
    deleteAssignment,
    gradeAssignment,
    getStudentAssignments
}; 