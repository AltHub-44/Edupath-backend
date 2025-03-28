const express = require('express')
const adminController = require('../controllers/adminController')
const validateRquest = require('../../../middlewares/validateRquest')
const { addMentorSchema } = require('../validators/adminValidator')
const analyticsController = require('../controllers/analyticsControllers')

const router = express.Router();

router.get('/', (req, res) => {
    console.log('Welcome to admin');
})
router.post('/create-mentor', validateRquest(addMentorSchema), adminController.createMentor)
router.post('/assign-mentor', adminController.assignMentorToStudent)

//analytics
router.get('/analytics/all-users', analyticsController.totalUser)
router.get('/analytics/all-mentors', analyticsController.totalMentor)

module.exports = router