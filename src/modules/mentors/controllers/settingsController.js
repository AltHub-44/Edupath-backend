const Mentor = require("../../../models/mentorModel");

const updateSettings = async (req, res) => {
    try {
        const mentor = await Mentor.findOne({ where: { userId: req.user.id } });

        if (!mentor) return res.status(404).json({ error: "Mentor not found" });

        await mentor.update(req.body);

        res.json({ success: true, message: "Settings updated successfully" });
    } catch (error) {
        console.error("Error updating settings:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { updateSettings };
