const authServices = require('../services/authServices')

const createUser = async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    try {
      const token = await authServices.registerUser(firstname, lastname, email, password);
      res.status(201).json({ success: true, token });
    } catch (err) {
      console.log(err)
      res.status(err.statusCode).json({ success: false, message: err.message });
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