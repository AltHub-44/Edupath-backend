const authServices = require('../services/authServices')

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

  module.exports = {
    createUser,
    loginUser
  }