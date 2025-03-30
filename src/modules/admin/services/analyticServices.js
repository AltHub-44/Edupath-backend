const User = require('../../../models/userModel')
const { error } = require('../../../utils/helpers')


//all students
const allUsers = async () => {
    try{
        const getUsers = await User.count({ where: { role: 'student' } });
        if(!getUsers) error(404, 'No user found');
        return getUsers
    }
    catch(err){
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
}

//all Mentors
const allMentors = async () => {
    try{
        const getMentors = await User.count({ where: { role: 'mentor' } });
        if(!getMentors) error(404, 'No mentor found');
        return getMentors
    }
    catch(err){
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
}


module.exports = {
    allUsers,
    allMentors
}