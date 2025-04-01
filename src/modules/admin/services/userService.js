const User = require('../../../models/userModel')
const { error } = require('../../../utils/helpers')

const getAll = async () => {
    try{
        const users = User.findAll()
        if(!users) error(404, 'No user found')
        return users
    }
    catch(err){
        error(err.statusCode || 500, err.message || "Internal server error");
    }
}

module.exports = {
    getAll
}