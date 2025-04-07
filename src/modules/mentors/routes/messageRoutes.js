const express = require("express");
const { getMessages, sendMessage } = require("../controllers/messageController");
const authMiddleware = require("../../../middlewares/authMiddleware");

const router = express.Router();

router.get("/:menteeId", authMiddleware, getMessages);
router.post("/send", authMiddleware, sendMessage);

module.exports = router;
