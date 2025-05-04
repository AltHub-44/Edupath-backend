const dashboardService = require('../services/dashboardService');

const getDashboardOverview = async (req, res) => {
    try {
        const mentorId = req.user.id;
        const overview = await dashboardService.getDashboardOverview(mentorId);
        res.status(200).json({ success: true, data: overview });
    } catch (err) {
        res.status(err.statusCode || 500).json({ 
            success: false, 
            message: err.message || 'Internal server error' 
        });
    }
};

module.exports = {
    getDashboardOverview
}; 