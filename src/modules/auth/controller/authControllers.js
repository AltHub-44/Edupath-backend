const authServices = require('../services/authServices')
const sendToQueue = require('../../../utils/queMailService')
const frontendURL = process.env.FRONTEND_URL;

const createUser = async (req, res) => {
    
    try {
      const { firstName, lastName, email, password } = req.body;

      
      const token = await authServices.registerUser({ firstName, lastName, email, password });
      res.status(201).json({ success: true, token });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try{
      const token = await authServices.loginUser(email, password)
      res.status(200).json({ success: true, token })

    }
    catch(err){
      res.status(err.statusCode).json({ success: false, message: err.message})
    }
  }

  const recoverPassword = async (req, res) => {
    const { email } = req.body;
    try{
      const response = await authServices.recoverPassword(email)
      // send email using response data
      const url = `${frontendURL}/reset-password?token=${response.token}`;
      const emailData = {
        token: url,
        email: response.email
      };
      await sendToQueue(emailData);
      //remove data from response object once email service is up and running
      res.status(200).json({ success: true, message: 'Email Sent Successfully' })
    }
    catch(err){
      res.status(err.statusCode).json({ success: false, message: err.message })
    }
  }

  const resetPassword = async (req, res) => {
    const { token, password } = req.body;
    try{
      await authServices.resetPassword(token, password);
      res.status(200).json({ success: true, message: 'Password updated successfully' });
    }
    catch(err){
      res.status(err.statusCode).json({ success: false, message: err.message });
    }
  }

  module.exports = {
    createUser,
    loginUser,
    recoverPassword,
    resetPassword
  }