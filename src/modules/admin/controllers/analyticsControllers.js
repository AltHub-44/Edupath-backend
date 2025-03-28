const analyticsServices = require('../services/analyticServices')
// total users
const totalUser = async (req, res) => {
    try{
        const userCount = await analyticsServices.allUsers();
        res.status(200).json({ success: true, message: 'all users fetched successfully', data: userCount })
    }   
    catch(err){
        res.status(err.statusCode).json({ success: false, message: err.message })
    }
}

// total mentors

const totalMentor = async (req, res) => {
    try{
        const mentorCount = await analyticsServices.allMentors();
        res.status(200).json({ success: true, message: 'all mentors fetched successfully', data: mentorCount })
    }   
    catch(err){
        res.status(err.statusCode).json({ success: false, message: err.message })
    }
}

// active courses

// revenue


// mentor sessions 

// course completion 

module.exports = {
    totalUser,
    totalMentor
}