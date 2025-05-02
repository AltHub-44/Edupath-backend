const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const Progress = sequelize.define('Progress', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    studentId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    milestone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
        defaultValue: 'pending'
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    completionDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    metrics: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {
            assignmentsCompleted: 0,
            sessionsAttended: 0,
            averageGrade: 0,
            lastUpdated: null
        }
    }
}, {
    timestamps: true,
    indexes: [
        {
            fields: ['studentId']
        },
        {
            fields: ['status']
        }
    ]
});

module.exports = Progress; 