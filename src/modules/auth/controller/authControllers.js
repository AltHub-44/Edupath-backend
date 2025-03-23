const authServices = require("../services/authServices");
const sendToQueue = require("../../../utils/queMailService");
const frontendURL = process.env.FRONTEND_URL;
const { registerSchema, loginSchema } = require("../validators/authValidator");

const createUser = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map(err => err.message),
      });
    }

    const { firstName, lastName, email, password } = req.body;

    const token = await authServices.registerUser({ firstName, lastName, email, password });

    res.status(201).json({ success: true, message: 'User registration successful.', token });
  } catch (err) {
    res.status(err.statusCode).json({ success: false, message: err.message});
  }
};

const loginUser = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map(err => err.message),
      });
    }

    const { email, password } = req.body;

    const token = await authServices.loginUser(email, password);

    res.status(200).json({ success: true, token });
  } catch (err) {
    // console.error("Login error:", err);
    res.status(err.statusCode).json({ success: false, message: err.message || "Internal Server Error!"});
  }
};

const recoverPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const response = await authServices.recoverPassword(email);

    // Send email using response data
    const url = `${frontendURL}/reset-password?token=${response.token}`;
    const emailData = {
      token: url,
      email: response.email,
    };
    await sendToQueue(emailData);

    res.status(200).json({ success: true, message: "Email Sent Successfully" });
  } catch (err) {
    res.status(err.statusCode).json({ success: false, message: err.message });
  }
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    await authServices.resetPassword(token, password);
    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(err.statusCode).json({ success: false, message: err.message });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;
  try{
      await authServices.updatePassword(userId, oldPassword, newPassword);
      res.status(200,).json({ success: true, message: "Password updated successfully!" });
  }
  catch(err){
    res.status(err.statusCode).json({ success:false, message: err.message });
  }
}

module.exports = {
  createUser,
  loginUser,
  recoverPassword,
  resetPassword,
  changePassword,
};
