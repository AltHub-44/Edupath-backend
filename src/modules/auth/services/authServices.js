const User = require('../models/userModel')
const { generateToken } = require('../../../utils/jwt')
const { error } = require('../../../utils/helpers')
const bcrypt = require('bcrypt')

const registerUser = async (firstname, lastname, email, password) => {
    try {
        const userExists = await User.findOne({ where: { email } });
        if (userExists)error(409, 'User already exists');
    
        const encryptedPassword = await bcrypt.hash(password, 10);
    
        const newUser = await User.create({ firstname, lastname, email, password: encryptedPassword });
        const payload = { id: newUser.id, firstname, lastname, email };
    
        return generateToken(payload);
    } catch (err) {
      throw error(err.statusCode, err.message || 'An unexpected error occurred');
    }
  };
  

const loginUser = async (email, password) => {
    try{
        const user = await User.findOne({ where: { email }})

        if(!user)error(401, 'Invalid Credentials | email');

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid)error(401, 'Invalid Credentials(password)')

        return generateToken(user)
    }
    catch(err){
        error(err.statusCode, err.message || 'An unexpected error occurred')
    }
   
}

module.exports = {
    registerUser,
    loginUser
}