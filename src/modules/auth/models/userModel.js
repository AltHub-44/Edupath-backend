const db = require('../../../database/db');
const { DataTypes } = require('sequelize')
const User = db.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, 
      },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('student', 'mentor', 'parent'),
      defaultValue: 'student',
      allowNull: false,
    },
    isNew: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isOnboarded: {
      type: DataTypes.BOOLEAN,
      defaultValue: false 
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
  },
  resetTokenExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  },

 /*  googleId: { 
    type: DataTypes.STRING, 
    allowNull: true 
  }, */
   /*  facebookId: { 
      type: DataTypes.STRING, 
      allowNull: true 
  },
 */
  },
);

module.exports = User;
  