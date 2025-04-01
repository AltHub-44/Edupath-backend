const userService = require('../services/userService')
const getAll = async (req, res) => {
    try{
        const users = await userService.getAll();

        res.status(200).json({ success: true, message: 'user fetched succefully', data: users });
    }
    catch(err){
        res.status(err.statusCode).json({ success: false, message: err.message })
    }
}

module.exports = {
    getAll
}