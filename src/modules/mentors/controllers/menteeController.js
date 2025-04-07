const Mentor = require("../../models/mentorModel");
const User = require("../../models/userModel");

const getMentees = async (req, res) => {
    try {
        const mentor = await Mentor.findOne({ where: { userId: req.user.id } });

        if (!mentor) return res.status(404).json({ error: "Mentor not found" });

        const mentees = await Mentee.findAll({
            where: { mentorId: mentor.id },
            attributes: ["id", "firstName", "lastName", "email", "status"],
        });

        res.json({ success: true, mentees });
    } catch (error) {
        console.error("Error fetching mentees:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getMenteeProfile = async (req, res) => {
    try {
        const { menteeId } = req.params;
        const mentee = await Mentee.findByPk(menteeId, {
            attributes: ["id", "firstName", "lastName", "email", "phone", "bio", "status"],
        });

        if (!mentee) return res.status(404).json({ error: "Mentee not found" });

        res.json({ success: true, mentee });
    } catch (error) {
        console.error("Error fetching mentee profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { getMentees, getMenteeProfile };