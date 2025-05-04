const userService = require('../services/userService')
const getAll = async (req, res) => {
    try{
        const { search, role, status, page } = req.query
        const users = await userService.getAll({ search, role, status, page });

        res.status(200).json({ success: true, message: 'user fetched succefully', data: users });
    }
    catch(err){
        res.status(err.statusCode).json({ success: false, message: err.message })
    }
}

//create a new user
const newUser = async (req, res) => {
    try{
        const {firstName, lastName, email, password, role} = req.body

        const user = await userService.addUser({ firstName, lastName, email, password, role })

        res.status(201).json({ success: true, message: 'User created Successfully', data: user });
    }
    catch(err){
        res.status(err.statusCode).json({ success: false, message: err.message })
    }
    

}
module.exports = {
    getAll,
    newUser
}