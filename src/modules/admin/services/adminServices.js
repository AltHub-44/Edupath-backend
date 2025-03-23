const { error } = require('../../../utils/helpers')
const User = require('../../auth/models/userModel');
const bcrypt = require('bcrypt');
const { generateToken } = require('../../../utils/jwt');

const createMentor = async (firstName, lastName, email, password) => {
    try{
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
            role: 'mentor',
  
        });
        const token = await generateToken(newUser);

        return (token);
    } catch (err) {
        error(500, err.message)
    }
}

module.exports = {
    createMentor
}