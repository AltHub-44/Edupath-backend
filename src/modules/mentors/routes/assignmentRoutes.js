const express = require("express");
const { getAssignments, gradeAssignment } = require("../controllers/assignmentController");
const authMiddleware = require("../../../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getAssignments);
router.post("/:assignmentId/grade", authMiddleware, gradeAssignment);

module.exports = router;
