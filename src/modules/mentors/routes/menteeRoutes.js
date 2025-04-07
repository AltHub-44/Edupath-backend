const express = require("express");
const { getMentees } = require("../controllers/menteeController");
const authMiddleware = require("../../../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getMentees);
router.get("/:menteeId", authMiddleware, getMenteeProfile);

module.exports = router;
