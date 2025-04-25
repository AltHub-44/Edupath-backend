const express = require('express');
const router = express.Router();
const onboardingController = require('../../auth/controller/onboardingController');  
const authMiddleware = require('../../../middlewares/authMiddleware'); // Adjust path if needed

// Onboarding Routes
router.post('/', authMiddleware.authenticate, onboardingController.completeOnboarding);
router.get('/', authMiddleware.authenticate, onboardingController.getOnboardingStatus);
router.post("/complete", authMiddleware.authenticate, onboardingController.completeOnboarding)
router.get('/status', authMiddleware.authenticate, onboardingController.getOnboardingStatus);

module.exports = router;
