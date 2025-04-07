const Mentor = require("../../../models/mentorModel");

const updateProfile = async (req, res) => {
    try {
        const mentor = await Mentor.findOne({ where: { userId: req.user.id } });

        if (!mentor) {
            return res.status(404).json({ error: "Mentor not found" });
        }

        await mentor.update(req.body);

        res.json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { updateProfile };
