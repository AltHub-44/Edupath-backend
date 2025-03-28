const User = require("../../../models/mentorModel");
const Onboarding = require("../../../models/onboarding");

// Complete Onboarding
const completeOnboarding = async (req, res) => {
    try {
        const userId = req.user.id;
        const { role, level, learningPreference, challenges, goals } = req.body;

        // Ensure required fields are provided
        if (!role || !level || !learningPreference || !challenges || !goals) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Check if onboarding already exists
        let onboarding = await Onboarding.findOne({ where: { userId } });
        if (onboarding) {
            return res.status(400).json({ message: "Onboarding already completed" });
        }

        // Save onboarding info
        onboarding = await Onboarding.create({ userId, level, learningPreference, challenges, goals });

        // Update user table
        const user = await User.findByPk(userId);
        if (user) {
            user.role = role;
            user.isOnboarded = true;
            await user.save();
        }

        res.status(201).json({
            message: "Onboarding completed successfully",
            onboarding
        });
    } catch (error) {
        console.error("Onboarding Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get Onboarding Status
const getOnboardingStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const onboarding = await Onboarding.findOne({ where: { userId } });

        if (!onboarding) {
            return res.status(404).json({ error: "Onboarding not found." });
        }

        return res.status(200).json(onboarding);
    } catch (error) {
        console.error("Onboarding Status Error:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

module.exports = { completeOnboarding, getOnboardingStatus };
