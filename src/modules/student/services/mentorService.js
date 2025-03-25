const User = require('../../auth/models/userModel')
const StudentMentor = require('../models/mentorModel')
const { error } = require('../../../utils/helpers')

const getMentor = async (studentId) => {
    //get records from student mentor
    try{
        const studentMentor = await StudentMentor.findOne({ where: { studentId }})
        const mentor = studentMentor.mentorId

        if(!mentor) error(404, 'Mentor not yet assigned, request a new mentor')

        //retrieve mentor information
        const newMentor = await User.findOne( { where: { id: mentor }});

        const mentorData = {
            firstname: newMentor.firstName,
            lastname: newMentor.lastName,
            email: newMentor.email
        };

        return mentorData;

    }
    catch(err){
        error(err.statusCode || 500, err.message || 'Internal server error')
    }
}

module.exports = {
    getMentor
}