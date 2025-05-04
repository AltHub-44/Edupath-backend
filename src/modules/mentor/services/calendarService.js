const Calendar = require('../../../models/calendarModel');
const { Op } = require('sequelize');
const { error } = require('../../../utils/helpers');

// Get calendar events for a mentor with view type support
const getCalendarEvents = async (mentorId, startDate, endDate, viewType = 'month') => {
    try {
        const events = await Calendar.findAll({
            where: {
                mentorId,
                startTime: {
                    [Op.between]: [startDate, endDate]
                }
            },
            include: [{
                model: 'Users',
                as: 'student',
                attributes: ['id', 'firstName', 'lastName', 'email']
            }],
            order: [['startTime', 'ASC']]
        });

        // Group events by view type
        if (viewType === 'day') {
            return groupEventsByDay(events);
        } else if (viewType === 'week') {
            return groupEventsByWeek(events);
        } else {
            return groupEventsByMonth(events);
        }
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Failed to fetch calendar events');
    }
};

// Create a new calendar event
const createCalendarEvent = async (mentorId, eventData) => {
    try {
        // Calculate duration if not provided
        if (!eventData.duration && eventData.startTime && eventData.endTime) {
            eventData.duration = Math.round((new Date(eventData.endTime) - new Date(eventData.startTime)) / (1000 * 60));
        }

        const event = await Calendar.create({
            mentorId,
            ...eventData
        });

        return event;
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Failed to create calendar event');
    }
};

// Update an existing calendar event
const updateCalendarEvent = async (eventId, mentorId, eventData) => {
    try {
        const event = await Calendar.findOne({
            where: { id: eventId, mentorId }
        });

        if (!event) {
            error(404, 'Calendar event not found');
        }

        // Recalculate duration if times are updated
        if (eventData.startTime && eventData.endTime) {
            eventData.duration = Math.round((new Date(eventData.endTime) - new Date(eventData.startTime)) / (1000 * 60));
        }

        await event.update(eventData);
        return event;
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Failed to update calendar event');
    }
};

// Delete a calendar event
const deleteCalendarEvent = async (eventId, mentorId) => {
    try {
        const event = await Calendar.findOne({
            where: { id: eventId, mentorId }
        });

        if (!event) {
            error(404, 'Calendar event not found');
        }

        await event.destroy();
        return { message: 'Calendar event deleted successfully' };
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Failed to delete calendar event');
    }
};

// Set availability
const setAvailability = async (mentorId, availabilityData) => {
    try {
        const availability = await Calendar.create({
            mentorId,
            eventType: 'availability',
            ...availabilityData
        });

        return availability;
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Failed to set availability');
    }
};

// Get availability
const getAvailability = async (mentorId, startDate, endDate) => {
    try {
        const availability = await Calendar.findAll({
            where: {
                mentorId,
                eventType: 'availability',
                startTime: {
                    [Op.between]: [startDate, endDate]
                }
            },
            order: [['startTime', 'ASC']]
        });

        return availability;
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Failed to fetch availability');
    }
};

// Create recurring session
const createRecurringSession = async (mentorId, sessionData) => {
    try {
        const recurringSession = await Calendar.create({
            mentorId,
            eventType: 'recurring',
            isRecurring: true,
            ...sessionData
        });

        return recurringSession;
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Failed to create recurring session');
    }
};

// Helper functions for grouping events
const groupEventsByDay = (events) => {
    const grouped = {};
    events.forEach(event => {
        const date = new Date(event.startTime).toISOString().split('T')[0];
        if (!grouped[date]) {
            grouped[date] = [];
        }
        grouped[date].push(event);
    });
    return grouped;
};

const groupEventsByWeek = (events) => {
    const grouped = {};
    events.forEach(event => {
        const date = new Date(event.startTime);
        const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
        const weekKey = weekStart.toISOString().split('T')[0];
        if (!grouped[weekKey]) {
            grouped[weekKey] = [];
        }
        grouped[weekKey].push(event);
    });
    return grouped;
};

const groupEventsByMonth = (events) => {
    const grouped = {};
    events.forEach(event => {
        const date = new Date(event.startTime);
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        if (!grouped[monthKey]) {
            grouped[monthKey] = [];
        }
        grouped[monthKey].push(event);
    });
    return grouped;
};

module.exports = {
    getCalendarEvents,
    createCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
    setAvailability,
    getAvailability,
    createRecurringSession
}; 