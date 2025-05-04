const { DataTypes } = require('sequelize');
const sequelize = require('./src/database/db');

const Calendar = sequelize.define('Calendar', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    mentorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    studentId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    eventType: {
        type: DataTypes.ENUM('session', 'availability', 'recurring', 'break'),
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Duration in minutes'
    },
    isRecurring: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    recurrencePattern: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Stores recurrence pattern for recurring events (e.g., weekly, monthly)'
    },
    status: {
        type: DataTypes.ENUM('scheduled', 'completed', 'cancelled', 'pending'),
        defaultValue: 'scheduled'
    },
    sessionType: {
        type: DataTypes.ENUM('one-on-one', 'group', 'workshop'),
        allowNull: true
    },
    sessionFormat: {
        type: DataTypes.ENUM('video', 'audio', 'chat'),
        allowNull: true
    },
    meetingLink: {
        type: DataTypes.STRING,
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    externalCalendarId: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'ID of the event in external calendar (Google, Outlook, etc.)'
    },
    externalCalendarType: {
        type: DataTypes.ENUM('google', 'outlook', 'ical'),
        allowNull: true
    },
    metadata: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Additional metadata for the event'
    }
}, {
    timestamps: true,
    indexes: [
        {
            fields: ['mentorId', 'startTime']
        },
        {
            fields: ['eventType', 'status']
        },
        {
            fields: ['studentId']
        }
    ]
});

module.exports = Calendar; 