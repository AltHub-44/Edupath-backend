const Mentor = require("../../../models/mentorModel");

const getSchedule = async (req, res) => {
    try {
        const mentor = await Mentor.findOne({ where: { userId: req.user.id } });

        if (!mentor) {
            return res.status(404).json({ error: "Mentor not found" });
        }

        res.json({ success: true, schedule: mentor.availability });
    } catch (error) {
        console.error("Error fetching schedule:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { getSchedule };
