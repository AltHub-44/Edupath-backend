const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../../../middlewares/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware.authenticate);

// Get chat history with a student
router.get('/history/:studentId', chatController.getChatHistory);

// Send a new message
router.post('/send', chatController.sendMessage);

// Update message status
router.patch('/status/:messageId', chatController.updateMessageStatus);

// Edit a message
router.patch('/edit/:messageId', chatController.editMessage);

module.exports = router; 