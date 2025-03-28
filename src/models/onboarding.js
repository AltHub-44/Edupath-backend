const { DataTypes } = require("sequelize");
const sequelize = require('../database/db');
const User = require("../models/userModel"); // Import User model

const Onboarding = sequelize.define("onboarding", {
    userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: "id",
      },
        },
    level: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      learningPreference: {
          type: DataTypes.STRING ,
          allowNull: false,
        },
    challenges: {
          type: DataTypes.STRING,
          allowNull: false,
        },
    goals: {
          type: DataTypes.STRING,
          allowNull: false,
        },
});

module.exports = Onboarding;
