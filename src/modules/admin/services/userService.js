const { Op } = require('sequelize')
const bcrypt = require('bcrypt')
const User = require('../../../models/userModel')
const { error } = require('../../../utils/helpers')

const getAll = async ({ search, role, status, page = 1, perPage = 10}) => {
    try{

        const where = {}
                if(search){
                    where[Op.or] = [
                        { firstName: { [Op.iLike]: `%${search}%` } },
                        { lastName: { [Op.iLike]: `%${search}%` } },
                        { email: { [Op.iLike]: `%${search}%` } }
                    ]
                }
                if(role) where.role = role;
                if(status) where.status = status;
                const sortBy = [['createdAt', 'DESC']];
        
                  // Pagination
                const limit = parseInt(perPage, 10);
                const offset = (parseInt(page, 10) - 1) * limit;
        
                const users = await User.findAndCountAll({
                    where,
                    order: sortBy,
                    limit,
                    offset,
                });
        
                if (!users.rows.length) {
                    error(404, 'No user found');
                }
          
                const response =  {
                    total: users.count,
                    page: parseInt(page, 10),
                    perPage: limit,
                    totalPages: Math.ceil(users.count / limit),
                    users: users.rows,
                };
                return response
    }
    catch(err){
        error(err.statusCode || 500, err.message || "Internal server error");
    }
}

const addUser = async ({ firstName, lastName, email, password, role }) => {
    try{
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) error(401, 'User already exists')

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role
  
        });

        return newUser;

    }
    catch(err){
        error(err.statusCode || 500, err.message || 'Internal server error')
    }
}


module.exports = {
    getAll,
    addUser
}