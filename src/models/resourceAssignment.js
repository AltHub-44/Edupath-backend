const db = require('../database/db');
const { DataTypes } = require('sequelize');
const User = require('./userModel');
const Resource = require('./resource');

const ResourceAssignment = db.define('ResourceAssignment', {
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
  resourceId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Resource,
      key: 'id'
    }
  },
  assignedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('assigned', 'viewed', 'completed'),
    defaultValue: 'assigned'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

// Define associations
ResourceAssignment.belongsTo(User, { as: 'mentor', foreignKey: 'mentorId' });
ResourceAssignment.belongsTo(User, { as: 'mentee', foreignKey: 'menteeId' });
ResourceAssignment.belongsTo(Resource, { foreignKey: 'resourceId' });

module.exports = ResourceAssignment; 