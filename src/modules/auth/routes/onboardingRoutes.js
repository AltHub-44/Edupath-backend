const express = require('express');
const router = express.Router();
const onboardingController = require('../../auth/controller/onboardingController');  
const authMiddleware = require('../../../middlewares/authMiddleware'); // Adjust path if needed

// Onboarding Routes
router.post('/', authMiddleware, onboardingController.completeOnboarding);
router.get('/', authMiddleware, onboardingController.getOnboardingStatus);

module.exports = router;
