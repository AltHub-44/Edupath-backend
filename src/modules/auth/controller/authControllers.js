const { OAuth2Client } = require("google-auth-library");
const authServices = require("../services/authServices");
const sendToQueue = require("../../../utils/queMailService");
const frontendURL = process.env.FRONTEND_URL || process.env.LOCAL_URL;
const User = require("../../../modules/auth/models/userModel");
const { generateToken } = require("../../../utils/jwt");


// Google OAuth Client Setup
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const token = await authServices.registerUser({ firstName, lastName, email, password });

    res.status(201).json({ success: true, message: 'User registration successful.', token });
  } catch (err) {
    res.status(err.statusCode).json({ success: false, message: err.message});
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const token = await authServices.loginUser(email, password);

    res.status(200).json({ success: true, message: 'Welcome back', token });
  } catch (err) {
    res.status(err.statusCode).json({ success: false, message: err.message });
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

//  Google OAuth
const googleAuth = (req, res) => {
  const redirectUri = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=email%20profile&access_type=offline&prompt=consent`;


  res.redirect(redirectUri);
};

// Google OAuth Callback
const googleCallback = async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) {
            return res.status(400).json({ error: "Authorization code is missing" });
        }

        const { tokens } = await client.getToken(code);
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        const token = await authServices.googleAuthService(payload);

        res.json({ success: true, token });
    } catch (error) {
        console.error("Google OAuth Error:", error.message);
        res.status(500).json({ error: "Google authentication failed", details: error.message });
    }
};



const getUserProfile = async (req, res) => {
  try {
      const user = req.user; 
      if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
      }

      res.json({
          success: true,
          user: {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              role: user.role,
              isNew: user.isNew,
              isOnboarded: user.isOnboarded
          }
      });
  } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
  }
};



module.exports = {
  createUser,
  loginUser,
  recoverPassword,
  resetPassword,
  changePassword,
  googleAuth, 
  googleCallback, 
  getUserProfile,
 
};
