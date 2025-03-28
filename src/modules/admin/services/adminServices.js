const { error } = require('../../../utils/helpers')
const User = require('../../auth/models/userModel');
const StudentMentor = require('../../student/models/mentorModel')
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
        error(err.statusCode || 500, err.message || 'Internal server error')
    }
}

const assignMentorToStudent = async (studentId) => {
    try {

        const mentors = await User.findAll({ where: { role: "mentor" } });

        if (mentors.length === 0) error(404, 'No mentors available.');
    
        // Pick a random mentor
        const randomMentor = mentors[Math.floor(Math.random() * mentors.length)];
    
        newMentor = await StudentMentor.create({
             mentorId: randomMentor.id,
             studentId: studentId
            });

        return newMentor;
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
}
module.exports = {
    createMentor,
    assignMentorToStudent
}