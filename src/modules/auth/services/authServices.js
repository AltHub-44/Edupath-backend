const User = require('../models/userModel')
const { randomBytes } = require('node:crypto');
const { generateToken } = require('../../../utils/jwt')
const { error } = require('../../../utils/helpers')
const bcrypt = require('bcrypt');

const registerUser = async (userData) => {
    try {
        const { firstName, lastName, email, password } = userData;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) error(401, 'User already exists')

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
        error(err.statusCode || 500, err.message || 'Internal server error')
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
        error(err.statusCode || 500, err.message || 'An unexpected error occurred')
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
    //send email to the recipient rather than logging the token
    return ({ token: resetToken, email: user.email });
}
catch(err){
    error(err.statusCode || 500, err.message || 'Internal server error')
}
}

const resetPassword = async (token, newPassword) => {
    try{
        const user = await User.findOne({
            where: {
            resetToken: token,
            },
        });

        if(!user || (user.resetTokenExpires < new Date())) error(400, 'Invalid or Expired Token!');

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
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
}

const updatePassword = async (userId, oldPassword, newPassword) => {
    try{
         //validate inputs
        if(!oldPassword) error(400, 'Old password is required');
        if(!newPassword) error(400, 'New password is required');

        if(oldPassword === newPassword) error(400, 'Old password and new password cannot be  the same')

         //fetch and confirm old password is correct
        const user = await User.findByPk(userId)

        if (!user) error(404, 'User not found');

        // Check if old password matches
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) error(401, "Incorrect old password");
        //update the password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update(
            {
                password: hashedPassword,
                updateAt: new Date()
        });
        return true;
    }
    catch(err){
        error(err.statusCode || 500, err.message || 'Internal server error')
    }
}

module.exports = {
    registerUser,
    loginUser,
    recoverPassword,
    resetPassword,
    updatePassword
}