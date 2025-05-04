const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    threadId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'Messages',
            key: 'id'
        }
    },
    senderId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    receiverId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('text', 'file'),
        defaultValue: 'text'
    },
    status: {
        type: DataTypes.ENUM('sent', 'delivered', 'read'),
        defaultValue: 'sent'
    },
    isEdited: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    editedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    metadata: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {
            fileUrl: null,
            fileName: null,
            fileSize: null,
            fileType: null
        }
    }
}, {
    timestamps: true,
    indexes: [
        {
            fields: ['threadId']
        },
        {
            fields: ['senderId']
        },
        {
            fields: ['receiverId']
        },
        {
            fields: ['status']
        }
    ]
});

module.exports = Message; 