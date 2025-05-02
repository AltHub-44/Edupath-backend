const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const ResourceAssignment = sequelize.define('ResourceAssignment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    resourceId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Resources',
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
    mentorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
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
    },
    completionDate: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = ResourceAssignment; 