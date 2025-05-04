const express = require('express')
const mentorController = require('../controllers/mentorController')
const authMiddleware = require('../../../middlewares/authMiddleware')



const router = express.Router();

router.get('/get-mentor', authMiddleware.authenticate, mentorController.getMentor)

module.exports = router