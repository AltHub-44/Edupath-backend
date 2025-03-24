const authServices = require("../services/authServices");
const sendToQueue = require("../../../utils/queMailService");
const frontendURL = process.env.FRONTEND_URL || process.env.LOCAL_URL;
const { registerSchema, loginSchema } = require("../validators/authValidator");
const axios = require("axios");
const User  = require("../../../modules/auth/models/userModel");
const { generateToken } = require("../../../utils/jwt");





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

    res.status(200).json({ success: true, token });
  } catch (err) {
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

// ✅ Google OAuth
const googleAuth = (req, res) => {
  const redirectUri = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${frontendURL}/api/auth/google/callback&response_type=code&scope=email profile`;
  res.redirect(redirectUri);
};

// ✅ Google OAuth Callback
const googleCallback = async (req, res) => {
  try {
    console.log("Google Callback Query Params:", req.query); // Log the received query params

    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ error: "Authorization code is missing" });
    }

    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${frontendURL}/api/auth/google/callback`,
      grant_type: 'authorization_code',
      code,
    });

    console.log("Google Token Response:", tokenResponse.data);

    const accessToken = tokenResponse.data.access_token;
    const { data: userInfo } = await axios.get(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);

    console.log("Google User Info:", userInfo);

    let user = await User.findOne({ where: { email: userInfo.email } });
    if (!user) {
      user = await User.create({
        firstName: userInfo.given_name,
        lastName: userInfo.family_name,
        email: userInfo.email,
        
      });
    }

    const token = generateToken(user);
    res.json({ success: true, token });
  } catch (error) {
    console.error("Google OAuth Error:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Google authentication failed", details: error.message });
  }
};

/** 
 ✅ Facebook OAuth
const facebookAuth = (req, res) => {
  const redirectUri = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${backendURL}/api/auth/facebook/callback&scope=email,public_profile`;
  res.redirect(redirectUri);
};

// ✅ Facebook OAuth Callback
const facebookCallback = async (req, res) => {
  try {
    console.log("Facebook Callback Query Params:", req.query);

    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ error: "Authorization code is missing" });
    }

    // Exchange code for access token
    const tokenResponse = await axios.get(`https://graph.facebook.com/v18.0/oauth/access_token`, {
      params: {
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        redirect_uri: `${frontendURL}/api/auth/facebook/callback`,
        code,
      },
    });

    console.log("Facebook Token Response:", tokenResponse.data);
    const accessToken = tokenResponse.data.access_token;

    // Fetch user data without email
    const { data: userInfo } = await axios.get(`https://graph.facebook.com/me?fields=id,name,picture&access_token=${accessToken}`);

    console.log("Facebook User Info:", userInfo);

    let user = await User.findOne({ where: { facebookId: userInfo.id } });

    if (!user) {
      const [firstName, lastName] = userInfo.name.split(" ");
      user = await User.create({ firstName, lastName, facebookId: userInfo.id });
    }

    const token = generateToken(user);
    res.json({ success: true, token });
  } catch (error) {
    console.error("Facebook OAuth Error:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Facebook authentication failed", details: error.message });
  }
};
**/



module.exports = {
  createUser,
  loginUser,
  recoverPassword,
  resetPassword,
  changePassword,
  googleAuth, 
  googleCallback, 
  // facebookAuth,
  // facebookCallback 
};
