const sessionService = require('../services/sessionService');

const getCalendar = async (req, res) => {
    try {
        const mentorId = req.user.id;
        const { startDate, endDate } = req.query;
        const calendar = await sessionService.getCalendar(mentorId, startDate, endDate);
        res.status(200).json({ success: true, data: calendar });
    } catch (err) {
        res.status(err.statusCode || 500).json({ 
            success: false, 
            message: err.message || 'Internal server error' 
        });
    }
};

const scheduleSession = async (req, res) => {
    try {
        const mentorId = req.user.id;
        const { studentId, date, duration, type, notes } = req.body;
        const session = await sessionService.scheduleSession(mentorId, studentId, { date, duration, type, notes });
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
        const { sessionId } = req.params;
        const mentorId = req.user.id;
        const { status, notes, date, duration } = req.body;
        const session = await sessionService.updateSession(mentorId, sessionId, { status, notes, date, duration });
        res.status(200).json({ success: true, data: session });
    } catch (err) {
        res.status(err.statusCode || 500).json({ 
            success: false, 
            message: err.message || 'Internal server error' 
        });
    }
};

const getSessionHistory = async (req, res) => {
    try {
        const mentorId = req.user.id;
        const { page = 1, limit = 10 } = req.query;
        const history = await sessionService.getSessionHistory(mentorId, page, limit);
        res.status(200).json({ success: true, data: history });
    } catch (err) {
        res.status(err.statusCode || 500).json({ 
            success: false, 
            message: err.message || 'Internal server error' 
        });
    }
};

const getUpcomingSessions = async (req, res) => {
    try {
        const mentorId = req.user.id;
        const sessions = await sessionService.getUpcomingSessions(mentorId);
        res.status(200).json({ success: true, data: sessions });
    } catch (err) {
        res.status(err.statusCode || 500).json({ 
            success: false, 
            message: err.message || 'Internal server error' 
        });
    }
};

const getSessionTemplates = async (req, res) => {
    try {
        const mentorId = req.user.id;
        const templates = await sessionService.getSessionTemplates(mentorId);
        res.status(200).json({ success: true, data: templates });
    } catch (err) {
        res.status(err.statusCode || 500).json({ 
            success: false, 
            message: err.message || 'Internal server error' 
        });
    }
};

const createSessionTemplate = async (req, res) => {
    try {
        const mentorId = req.user.id;
        const templateData = req.body;
        const template = await sessionService.createSessionTemplate(mentorId, templateData);
        res.status(201).json({ success: true, data: template });
    } catch (err) {
        res.status(err.statusCode || 500).json({ 
            success: false, 
            message: err.message || 'Internal server error' 
        });
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