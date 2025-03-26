const db = require('../../../database/db');
const { DataTypes } = require('sequelize')
const User = require('../../auth/models/userModel')
const StudentMentor = db.define(
  'StudentMentor',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    mentorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id"
      },
    },
    studentId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
  },
);

module.exports = StudentMentor;
  