const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ResourceShare = sequelize.define('ResourceShare', {
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
    sharedBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    sharedWith: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    permission: {
        type: DataTypes.ENUM('view', 'edit', 'collaborate'),
        allowNull: false,
        defaultValue: 'view'
    },
    status: {
        type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
        allowNull: false,
        defaultValue: 'pending'
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = ResourceShare; 