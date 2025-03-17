const authServices = require("../services/authServices");
const { registerSchema, loginSchema } = require("../validators/authValidator");

const createUser = async (req, res) => {
  try {
      const { error } = registerSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map(err => err.message) 
      });
    }

    const { firstName, lastName, email, password } = req.body;

    const token = await authServices.registerUser({ firstName, lastName, email, password });

    res.status(201).json({ success: true, token });
  } catch (err) {
    console.error("Registration error:", err); 
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    
    const { error } = loginSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map(err => err.message)
      });
    }

    const { email, password } = req.body;

    const token = await authServices.loginUser(email, password);

    res.status(200).json({ success: true, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(err.statusCode || 500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  createUser,
  loginUser,
};
