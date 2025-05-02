const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const Assignment = sequelize.define('Assignment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
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
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    dueDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'submitted', 'graded', 'overdue'),
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
    attachments: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    submission: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {
            content: null,
            attachments: [],
            submittedAt: null
        }
    }
}, {
    timestamps: true,
    indexes: [
        {
            fields: ['mentorId']
        },
        {
            fields: ['studentId']
        },
        {
            fields: ['status']
        },
        {
            fields: ['dueDate']
        }
    ]
});

module.exports = Assignment; 