const adminService = require('../services/adminServices');
const createMentor = async (req, res) => {
    try{
        const { firstName, lastName, email, password } = req.body;

        const response = await adminService.createMentor(firstName, lastName, email, password)

        res.status(201).json({ success: true, message: 'Mentor created successfully', response});

    }
    catch(err){
        res.status(err.statusCode).json({ success: false, message: err.message });
    }
}

const assignMentorToStudent = async (req, res) => {
    try{
        const { studentId } = req.body

       const mentor = await adminService.assignMentorToStudent(studentId);

        res.status(201).json({ success: true, message: 'Mentor assigned to student successfully', mentor});
    }
    catch(err){
        res.status(err.statusCode).json({ success: false, message: err.message })
    }
}

module.exports = {
    createMentor,
    assignMentorToStudent
}