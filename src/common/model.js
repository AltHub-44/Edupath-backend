// const User = require('./User');
const User = require('../modules/auth/models/userModel')

// Define relationships
// Student.hasOne(Parent, { foreignKey: 'studentId' });
// Parent.belongsTo(Student, { foreignKey: 'studentId' });

module.exports = {
  User,
//   Parent,
};
