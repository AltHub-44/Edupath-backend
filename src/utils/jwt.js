const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign({ id: user.id, firstname: user.firstName, lastname: user.lastName, email: user.email, role: user.role, is_new: user.isNew }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

module.exports = { generateToken };