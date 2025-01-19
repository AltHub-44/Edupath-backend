const express = require('express')
const authController = require('../controller/authControllers')
// const validateRequest = require('../middlewares/validateRequest')
// const { registerSchema, loginSchema } = require('../validations/authValidation')

const router = express.Router()

router.post('/register', authController.createUser)
router.post('/login', authController.loginUser)
// router.post("/register", validateRequest(registerSchema), authController.register)
// router.post("/login", validateRequest(loginSchema) ,authController.login)

module.exports = router