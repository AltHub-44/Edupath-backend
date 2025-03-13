const User = require('../models/userModel')
const { generateToken } = require('../../../utils/jwt')
const { error } = require('../../../utils/helpers')
const bcrypt = require('bcrypt')

const registerUser = async (userData) => {
    try {
        const { firstName, lastName, email, password, role } = userData;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
  
        });

        return { message: 'User registered successfully', user: newUser };
    } catch (error) {
        throw error;
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