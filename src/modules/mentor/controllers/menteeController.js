const menteeService = require('../services/menteeService');

const getAllMentees = async (req, res) => {
    try {
        const mentorId = req.user.id;
        const mentees = await menteeService.getAllMentees(mentorId);
        res.status(200).json({ success: true, data: mentees });
    } catch (err) {
        res.status(err.statusCode || 500).json({ 
            success: false, 
            message: err.message || 'Internal server error' 
        });
    }
};

const getMenteeDetails = async (req, res) => {
    try {
        const { menteeId } = req.params;
        const mentorId = req.user.id;
        const menteeDetails = await menteeService.getMenteeDetails(mentorId, menteeId);
        res.status(200).json({ success: true, data: menteeDetails });
    } catch (err) {
        res.status(err.statusCode || 500).json({ 
            success: false, 
            message: err.message || 'Internal server error' 
        });
    }
};

const getMenteeProgress = async (req, res) => {
    try {
        const { menteeId } = req.params;
        const mentorId = req.user.id;
        const progress = await menteeService.getMenteeProgress(mentorId, menteeId);
        res.status(200).json({ success: true, data: progress });
    } catch (err) {
        res.status(err.statusCode || 500).json({ 
            success: false, 
            message: err.message || 'Internal server error' 
        });
    }
};

const getMenteeSessions = async (req, res) => {
    try {
        const { menteeId } = req.params;
        const mentorId = req.user.id;
        const sessions = await menteeService.getMenteeSessions(mentorId, menteeId);
        res.status(200).json({ success: true, data: sessions });
    } catch (err) {
        res.status(err.statusCode || 500).json({ 
            success: false, 
            message: err.message || 'Internal server error' 
        });
    }
};

const scheduleSession = async (req, res) => {
    try {
        const { menteeId } = req.params;
        const mentorId = req.user.id;
        const { date, duration, type, notes } = req.body;
        const session = await menteeService.scheduleSession(mentorId, menteeId, { date, duration, type, notes });
        res.status(201).json({ success: true, data: session });
    } catch (err) {
        res.status(err.statusCode || 500).json({ 
            success: false, 
            message: err.message || 'Internal server error' 
        });
    }
};

const updateSession = async (req, res) => {
    try {
        const { menteeId, sessionId } = req.params;
        const mentorId = req.user.id;
        const { status, notes } = req.body;
        const session = await menteeService.updateSession(mentorId, menteeId, sessionId, { status, notes });
        res.status(200).json({ success: true, data: session });
    } catch (err) {
        res.status(err.statusCode || 500).json({ 
            success: false, 
            message: err.message || 'Internal server error' 
        });
    }
};

const addProgressUpdate = async (req, res) => {
    try {
        const { menteeId } = req.params;
        const mentorId = req.user.id;
        const { milestones, achievements, notes } = req.body;
        const progress = await menteeService.addProgressUpdate(mentorId, menteeId, { milestones, achievements, notes });
        res.status(201).json({ success: true, data: progress });
    } catch (err) {
        res.status(err.statusCode || 500).json({ 
            success: false, 
            message: err.message || 'Internal server error' 
        });
    }
};

const sendMessage = async (req, res) => {
    try {
        const { menteeId } = req.params;
        const mentorId = req.user.id;
        const { content } = req.body;
        const message = await menteeService.sendMessage(mentorId, menteeId, content);
        res.status(201).json({ success: true, data: message });
    } catch (err) {
        res.status(err.statusCode || 500).json({ 
            success: false, 
            message: err.message || 'Internal server error' 
        });
    }
};

const getMessages = async (req, res) => {
    try {
        const { menteeId } = req.params;
        const mentorId = req.user.id;
        const messages = await menteeService.getMessages(mentorId, menteeId);
        res.status(200).json({ success: true, data: messages });
    } catch (err) {
        res.status(err.statusCode || 500).json({ 
            success: false, 
            message: err.message || 'Internal server error' 
        });
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