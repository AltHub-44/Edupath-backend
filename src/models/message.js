const db = require('../database/db');
const { DataTypes } = require('sequelize');
const User = require('./userModel');

const Message = db.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  receiverId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  threadId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  attachments: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  },
  messageType: {
    type: DataTypes.ENUM('text', 'file', 'assignment', 'resource', 'system'),
    defaultValue: 'text'
  },
  relatedId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  category: {
    type: DataTypes.ENUM('general', 'assignment', 'schedule', 'resource', 'support'),
    defaultValue: 'general'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'low'
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {
      readReceipts: [],
      reactions: [],
      mentions: []
    }
  },
  isEdited: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  editHistory: {
    type: DataTypes.ARRAY(DataTypes.JSONB),
    allowNull: true
  },
  isPinned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

// Define associations
Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });
Message.belongsTo(User, { as: 'receiver', foreignKey: 'receiverId' });

module.exports = Message; 