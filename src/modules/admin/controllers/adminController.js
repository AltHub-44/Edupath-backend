const adminService = require('../services/adminServices');
const createMentor = async (req, res) => {
    try{
        const { firstName, lastName, email, password } = req.body;

        const response = await adminService.createMentor(firstName, lastName, email, password)

        res.status(201).json({ success: true, message: 'Mentor created successfully', data: response});

    }
    catch(err){
        res.status(err.statusCode).json({ success: false, message: err.message });
    }
}

module.exports = {
    createMentor
}