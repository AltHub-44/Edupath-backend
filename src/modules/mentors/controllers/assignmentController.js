const Assignment = require("../../models/assignmentModel");
const Mentor = require("../../../models/mentorModel");

const getAssignments = async (req, res) => {
    try {
        const mentor = await Mentor.findOne({ where: { userId: req.user.id } });

        if (!mentor) return res.status(404).json({ error: "Mentor not found" });

        const assignments = await Assignment.findAll({
            where: { mentorId: mentor.id },
            attributes: ["id", "menteeId", "title", "status", "grade", "feedback"],
            order: [["status", "ASC"]],
        });

        res.json({ success: true, assignments });
    } catch (error) {
        console.error("Error fetching assignments:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const gradeAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const { grade, feedback } = req.body;

        const assignment = await Assignment.findByPk(assignmentId);
        if (!assignment) return res.status(404).json({ error: "Assignment not found" });

        assignment.grade = grade;
        assignment.feedback = feedback;
        assignment.status = "graded";
        await assignment.save();

        res.json({ success: true, message: "Assignment graded successfully" });
    } catch (error) {
        console.error("Error grading assignment:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { getAssignments, gradeAssignment };
