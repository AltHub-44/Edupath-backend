const  User  = require('../models/userModel'); // Ensure the correct path

//  Complete Onboarding
const completeOnboarding = async (req, res) => {
    try {
        const userId = req.user.id; 
        const { role } = req.body;

        const validRoles = ['student', 'mentor', 'parent'];
        if (!role || !validRoles.includes(role)) {
            return res.status(400).json({ error: "Invalid or missing role." });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        user.role = role;
        user.isOnboarded = true;
        await user.save();

        return res.status(200).json({
            message: "Onboarding completed successfully.",
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                isOnboarded: user.isOnboarded,
            }
        });
    } catch (error) {
        console.error("Onboarding Error:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

//  Get Onboarding Status
const getOnboardingStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId, {
            attributes: ['id', 'name', 'role', 'isOnboarded']
        });

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error("Onboarding Status Error:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};


module.exports = { completeOnboarding, getOnboardingStatus };
