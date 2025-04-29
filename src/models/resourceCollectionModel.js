const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ResourceCollection = sequelize.define('ResourceCollection', {
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
        allowNull: true
    },
    mentorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    isPublic: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    }
}, {
    timestamps: true
});

module.exports = ResourceCollection; 