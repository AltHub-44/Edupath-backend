const db = require('../database/db');
const { DataTypes } = require('sequelize')
const Resource = db.define(
  'Resource',
  {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    type: {
        type: DataTypes.ENUM("video", "audio", "pdf"),
        allowNull: false,
    },
    url: DataTypes.TEXT, // Cloudinary or S3 link
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        validate: { min: 0, max: 5 },
    },
    tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
    }
  },
);

module.exports = Resource;