const db = require('../database/db');
const { DataTypes } = require('sequelize');
const User = require('./userModel');

const Assignment = db.define('Assignment', {
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
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  submissionDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'submitted', 'reviewed', 'late'),
    defaultValue: 'pending'
  },
  grade: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  submission: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  attachments: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  },
  rubric: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {
      criteria: [],
      totalPoints: 100
    }
  },
  gradingCriteria: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  resubmissionAllowed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  maxResubmissions: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  resubmissionDeadline: {
    type: DataTypes.DATE,
    allowNull: true
  },
  comments: {
    type: DataTypes.ARRAY(DataTypes.JSONB),
    allowNull: true
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  },
  difficulty: {
    type: DataTypes.ENUM('easy', 'medium', 'hard'),
    allowNull: true
  },
  estimatedTime: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: true
  }
});

// Define associations
Assignment.belongsTo(User, { as: 'mentor', foreignKey: 'mentorId' });
Assignment.belongsTo(User, { as: 'mentee', foreignKey: 'menteeId' });

module.exports = Assignment; 