const { DataTypes } = require("sequelize");
const sequelize = require('../../../database/db');
const User = require("./userModel"); // Import User model

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
          type: DataTypes.ENUM("Primary", "Junior Secondary", "Senior Secondary"),
          allowNull: false,
        },
      learningPreference: {
          type: DataTypes.ENUM("Quizzes", "Videos", "P2P Learning", "Others"),
          allowNull: false,
        },
    challenges: {
          type: DataTypes.ENUM("Mathematics", "English", "Physics", "Chemistry", "Biology", "Economics", "Government", "Others"),
          allowNull: false,
        },
    goals: {
          type: DataTypes.ENUM("Get into University", "Pass a particular exam", "Improve in studies", "Others"),
          allowNull: false,
        },
});

module.exports = Onboarding;
