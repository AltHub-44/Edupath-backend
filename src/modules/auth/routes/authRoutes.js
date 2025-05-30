const express = require('express');
const authController = require('../controller/authControllers');
const validateRequest = require('../../../middlewares/validateRquest'); // Middleware to handle Joi validation
const { registerSchema,
     loginSchema, 
     changePasswordSchema, 
     recoverPasswordSchema, 
     resetPasswordSchema } = require('../validators/authValidator');
const authMiddleware = require('../../../middlewares/authMiddleware');
const getUserProfile = require('../controller/authControllers');

const router = express.Router();

router.post('/register', validateRequest(registerSchema), authController.createUser);
router.post('/mentor/register', validateRequest(registerSchema), authController.createMentor);
router.post('/login', validateRequest(loginSchema), authController.loginUser);
router.post('/recover-password', validateRequest(recoverPasswordSchema), authController.recoverPassword)
router.post('/reset-password', validateRequest(resetPasswordSchema), authController.resetPassword);
router.post('/change-password', authMiddleware.authenticate, validateRequest(changePasswordSchema), authController.changePassword)

router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleCallback);
router.get('/user/profile', authMiddleware.authenticate, authController.getUserProfile);

module.exports = router