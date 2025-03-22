const User = require('../models/userModel')
const { randomBytes } = require('node:crypto');
const { generateToken } = require('../../../utils/jwt')
const { error } = require('../../../utils/helpers')
const bcrypt = require('bcrypt');

const registerUser = async (userData) => {
    try {
        const { firstName, lastName, email, password } = userData;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            error(401, 'User already exists')
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
  
        });
        const token = await generateToken(newUser);

        return (token);
    } catch (err) {
        error(500, err.message)
    }
  };
  

const loginUser = async (email, password) => {
    try{
        const user = await User.findOne({ where: { email }})

        if(!user)error(401, 'Invalid Credentials');

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid)error(401, 'Invalid Credentials')

        //check if user account isNew istrue and set it to false
        if(user.isNew){
            await user.update({ isNew: false });
        }

        const token = await generateToken(user)
        return token;
    }
    catch(err){
        error(500, err.message || 'An unexpected error occurred')
    }
}

const recoverPassword = async (email) => {
    try{
    const user = await User.findOne( { where: { email }});

    if(!user)error(401, 'No User with provided email address found!');

    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + (60 * 60 * 1000)); // 1 hour from now

    //update user's table with the reset token and token expiry
    await user.update({
        resetToken,
        resetTokenExpires
    });

    console.log("reset token:", resetToken, "expiry:", resetTokenExpires)
    //send email to the recipient rather than logging the token
    return ({ token: resetToken, email: user.email });
}
catch(err){
    error(500, err.message)
}
}
const resetPassword = async (token, newPassword) => {
    try{
        const user = await User.findOne({
            where: {
            resetToken: token,
            },
        });

        if(!user || (user.resetTokenExpires < new Date()))error(400, 'Invalid or Expired Token!');

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        //update password and clear reset token
        await user.update({
            password: hashedPassword,
            resetToken: null,
            resetTokenExpires: null
        });
        return;
    }
    catch(err){
        error(500, err.message);
    }
}

module.exports = {
    registerUser,
    loginUser,
    recoverPassword,
    resetPassword
}