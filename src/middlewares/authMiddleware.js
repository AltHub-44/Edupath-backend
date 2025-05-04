const jwt = require('jsonwebtoken');
const  User  = require('../models/userModel'); // Ensure the correct path

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1]; // Expect "Bearer <token>"
        if (!token) {
            return res.status(401).json({ error: "Access denied. No token provided." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure `JWT_SECRET` is set in `.env`
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({ error: "Invalid token." });
        }

        req.user = user; // Attach user data to request
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(401).json({ error: "Invalid or expired token." });
    }
};

const adminAuthorize = (req, res, next) => {
    try{
        const user = req.user;
        if(!user){
            return res.status(401).json( { success: false, message: "Invalid token, Please login to continue"} );
        }

        const role = user.role;
        if(role !== 'admin'){
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }
        next();
    }
    catch(err){
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}


module.exports = {
    authenticate,
    adminAuthorize
}
