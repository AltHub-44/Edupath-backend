const db = require('../database/db');
const { DataTypes } = require('sequelize')
const ResourceCategory = require('./resourceCategory');
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
        type: DataTypes.ENUM("video", "video series", "pdf", "document"),
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
    },
    state: {
      type: DataTypes.ENUM("active", "inactive", "draft"),
      allowNull: false,
      defaultValue: 'draft',
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ResourceCategories',
        key: 'id'
      }
    },
  },
);

// Define the association
Resource.belongsTo(ResourceCategory, { foreignKey: "categoryId", as: "category" });

module.exports = Resource;