const db = require('../database/db');
const { DataTypes } = require('sequelize')
const ResourceCategory = db.define(
  'ResourceCategory',
  {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
  },
);

module.exports = ResourceCategory;