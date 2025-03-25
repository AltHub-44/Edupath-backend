const mentorService = require('../services/mentorService')

const getMentor = async (req, res) => {
    try{
        const studentId = req.user.id
        // const userId = req.user.id;
        const mentor = await mentorService.getMentor(studentId);

        res.status(200).json( { success: true, data: mentor })
    }
    catch(err){
        res.status(err.statusCode).json( { success: false, message: err.message });
    }
}

module.exports = {
    getMentor
}