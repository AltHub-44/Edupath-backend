const User = require("../models/userModel");
const Onboarding = require("../models/onboarding");

// Complete Onboarding
const completeOnboarding = async (req, res) => {
    try {
        const userId = req.user.id;
        const { role, level, learningPreference, challenges, goals } = req.body;

        // Validate role
        const validRoles = ['student', 'mentor', 'parent'];
        if (!role || !validRoles.includes(role)) {
            return res.status(400).json({ error: "Invalid or missing role." });
        }

        // Validate level
        const validLevels = ['Primary', 'Junior Secondary', 'Senior Secondary'];
        if (!level || !validLevels.includes(level)) {
            return res.status(400).json({ error: "Invalid or missing level." });
        }

        // Validate learning preference
        const validPreferences = ['Quizzes', 'Videos', 'Peer-to-Peer Learning', 'Live Tutorials', 'Self-paced Learning'];
        if (!learningPreference || !validPreferences.includes(learningPreference)) {
            return res.status(400).json({ error: "Invalid or missing learning preference." });
        }

        // Validate challenges
        const validChallenges = ['Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Government', 'History', 'Literature', 'Computer Science', 'Others'];
        if (!challenges || !validChallenges.includes(challenges)) {
            return res.status(400).json({ error: "Invalid or missing challenge." });
        }

        // Validate goals
        const validGoals = ['Get into University', 'Pass WAEC/NECO/JAMB', 'Improve in a Subject', 'Score Higher in Tests', 'Become More Confident in Studies', 'Prepare for International Exams (SAT, TOEFL, IELTS)'];
        if (!goals || !validGoals.includes(goals)) {
            return res.status(400).json({ error: "Invalid or missing goal." });
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
