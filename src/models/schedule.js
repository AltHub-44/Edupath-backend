const db = require('../database/db');
const { DataTypes } = require('sequelize');
const User = require('./userModel');

const Schedule = db.define('Schedule', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  mentorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  menteeId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: User,
      key: 'id'
    }
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('available', 'booked', 'completed', 'cancelled'),
    defaultValue: 'available'
  },
  type: {
    type: DataTypes.ENUM('availability', 'session'),
    allowNull: false
  },
  sessionType: {
    type: DataTypes.ENUM('one-on-one', 'group'),
    defaultValue: 'one-on-one'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
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
  isRecurring: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  recurrencePattern: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {
      frequency: null, // daily, weekly, monthly
      interval: 1,
      daysOfWeek: [],
      endDate: null
    }
  },
  participants: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    allowNull: true
  },
  maxParticipants: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  agenda: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  materials: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  }
});

// Define associations
Schedule.belongsTo(User, { as: 'mentor', foreignKey: 'mentorId' });
Schedule.belongsTo(User, { as: 'mentee', foreignKey: 'menteeId' });

module.exports = Schedule; 