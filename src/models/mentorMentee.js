const db = require('../database/db');
const { DataTypes } = require('sequelize');
const User = require('./userModel');

const MentorMentee = db.define('MentorMentee', {
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
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'pending'),
    defaultValue: 'pending'
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

// Define associations
MentorMentee.belongsTo(User, { as: 'mentor', foreignKey: 'mentorId' });
MentorMentee.belongsTo(User, { as: 'mentee', foreignKey: 'menteeId' });

module.exports = MentorMentee; 