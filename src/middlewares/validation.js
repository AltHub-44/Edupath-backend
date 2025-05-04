// Calendar event validation
const validateCalendarEvent = (req, res, next) => {
    const { title, startTime, endTime, eventType } = req.body;

    if (!title || !startTime || !endTime || !eventType) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields: title, startTime, endTime, eventType'
        });
    }

    if (new Date(startTime) >= new Date(endTime)) {
        return res.status(400).json({
            success: false,
            message: 'Start time must be before end time'
        });
    }

    if (!['session', 'availability', 'recurring'].includes(eventType)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid event type'
        });
    }

    next();
};

// Availability validation
const validateAvailability = (req, res, next) => {
    const { startTime, endTime, daysOfWeek } = req.body;

    if (!startTime || !endTime) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields: startTime, endTime'
        });
    }

    if (new Date(startTime) >= new Date(endTime)) {
        return res.status(400).json({
            success: false,
            message: 'Start time must be before end time'
        });
    }

    if (daysOfWeek && !Array.isArray(daysOfWeek)) {
        return res.status(400).json({
            success: false,
            message: 'daysOfWeek must be an array'
        });
    }

    next();
};

// Recurring session validation
const validateRecurringSession = (req, res, next) => {
    const { title, startTime, endTime, recurrencePattern } = req.body;

    if (!title || !startTime || !endTime || !recurrencePattern) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields: title, startTime, endTime, recurrencePattern'
        });
    }

    if (new Date(startTime) >= new Date(endTime)) {
        return res.status(400).json({
            success: false,
            message: 'Start time must be before end time'
        });
    }

    if (!recurrencePattern.frequency || !['daily', 'weekly', 'monthly'].includes(recurrencePattern.frequency)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid recurrence frequency'
        });
    }

    next();
};

module.exports = {
    validateCalendarEvent,
    validateAvailability,
    validateRecurringSession
}; 