const calendarService = require('../services/calendarService');
const { success, error } = require('../../../utils/helpers');

// Get calendar events
const getCalendarEvents = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const events = await calendarService.getCalendarEvents(req.user.id, startDate, endDate);
        success(res, 200, 'Calendar events fetched successfully', events);
    } catch (err) {
        error(res, err.statusCode || 500, err.message);
    }
};

// Create calendar event
const createCalendarEvent = async (req, res) => {
    try {
        const event = await calendarService.createCalendarEvent(req.user.id, req.body);
        success(res, 201, 'Calendar event created successfully', event);
    } catch (err) {
        error(res, err.statusCode || 500, err.message);
    }
};

// Update calendar event
const updateCalendarEvent = async (req, res) => {
    try {
        const event = await calendarService.updateCalendarEvent(req.params.eventId, req.user.id, req.body);
        success(res, 200, 'Calendar event updated successfully', event);
    } catch (err) {
        error(res, err.statusCode || 500, err.message);
    }
};

// Delete calendar event
const deleteCalendarEvent = async (req, res) => {
    try {
        const result = await calendarService.deleteCalendarEvent(req.params.eventId, req.user.id);
        success(res, 200, result.message);
    } catch (err) {
        error(res, err.statusCode || 500, err.message);
    }
};

// Set availability
const setAvailability = async (req, res) => {
    try {
        const availability = await calendarService.setAvailability(req.user.id, req.body);
        success(res, 201, 'Availability set successfully', availability);
    } catch (err) {
        error(res, err.statusCode || 500, err.message);
    }
};

// Get availability
const getAvailability = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const availability = await calendarService.getAvailability(req.user.id, startDate, endDate);
        success(res, 200, 'Availability fetched successfully', availability);
    } catch (err) {
        error(res, err.statusCode || 500, err.message);
    }
};

// Create recurring session
const createRecurringSession = async (req, res) => {
    try {
        const session = await calendarService.createRecurringSession(req.user.id, req.body);
        success(res, 201, 'Recurring session created successfully', session);
    } catch (err) {
        error(res, err.statusCode || 500, err.message);
    }
};

// Sync with external calendar
const syncWithExternalCalendar = async (req, res) => {
    try {
        const { calendarType, events } = req.body;
        const syncedEvents = await calendarService.syncWithExternalCalendar(req.user.id, calendarType, events);
        success(res, 200, 'Calendar synced successfully', syncedEvents);
    } catch (err) {
        error(res, err.statusCode || 500, err.message);
    }
};

module.exports = {
    getCalendarEvents,
    createCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
    setAvailability,
    getAvailability,
    createRecurringSession,
    syncWithExternalCalendar
}; 