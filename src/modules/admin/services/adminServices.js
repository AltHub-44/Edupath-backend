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
        error(500, err.message)
    }
}

const assignMentorToStudent = async (studentId) => {
    try {
        // const mentor = await User.findOne({
        //     where: { role: "mentor" },
        //     order: sequelize.literal("RANDOM()"),
        // });

        const mentors = await User.findAll({ where: { role: "mentor" } });

        if (mentors.length === 0) error(404, 'No mentors available.');
    
        // Pick a random mentor using JavaScript
        const randomMentor = mentors[Math.floor(Math.random() * mentors.length)];
    
        // return randomMentor.id;

        // if (!mentor) error(404, 'No mentors available.')

        await StudentMentor.create({
             mentorId: randomMentor.id,
             studentId: studentId
            });

        // res.status(200).json({ message: "Mentor assigned successfully!" });
        return
    } catch (err) {
        error(500, err.message);
    }
}
module.exports = {
    createMentor,
    assignMentorToStudent
}