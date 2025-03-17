const express = require('express');
const authController = require('../controller/authControllers');
//const validateRequest = require('../../middlewares/validateRequest'); // Middleware to handle Joi validation
const { registerSchema, loginSchema } = require('../validators/authValidator');

const router = express.Router();

router.post('/register', authController.createUser);
router.post('/login', authController.loginUser);

module.exports = router;
