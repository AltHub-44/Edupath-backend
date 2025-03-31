const express = require('express')
const adminController = require('../controllers/adminController')
const validateRquest = require('../../../middlewares/validateRquest')
const { addMentorSchema } = require('../validators/adminValidator')
const analyticsController = require('../controllers/analyticsControllers')
const resourceController = require('../controllers/resourceControllers')
const { addCategorySchema, addResourceSchema, getResourcesSchema, updateResourceSchema } = require('../validators/resourceValidator')

const router = express.Router();

router.get('/', (req, res) => {
    console.log('Welcome to admin');
})
router.post('/create-mentor', validateRquest(addMentorSchema), adminController.createMentor)
router.post('/assign-mentor', adminController.assignMentorToStudent)

//analytics
router.get('/analytics/all-users', analyticsController.totalUser)
router.get('/analytics/all-mentors', analyticsController.totalMentor)

//---------------------RESOURCES----------------------------------
//category
router.post('/resource/category', validateRquest(addCategorySchema), resourceController.addNew)
router.get('/resource/category', resourceController.getAll)
//resource
router.post('/resource', validateRquest(addResourceSchema), resourceController.addResource)
router.get('/resource', validateRquest(getResourcesSchema),resourceController.getAllResources)
router.get('/resource/:id', resourceController.getSingleResource)
router.put('/resource/:id', validateRquest(updateResourceSchema), resourceController.updateSingleResource)
router.delete('/resource/:id', resourceController.deleteResource)

module.exports = router