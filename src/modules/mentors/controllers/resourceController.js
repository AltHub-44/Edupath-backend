const Resource = require("../../../models/resource");

const getResources = async (req, res) => {
    try {
        const resources = await Resource.findAll({
            attributes: ["id", "title", "type", "url", "tags"],
        });

        res.json({ success: true, resources });
    } catch (error) {
        console.error("Error fetching resources:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const assignResource = async (req, res) => {
    try {
        const { menteeId, resourceId } = req.body;

        await ResourceAssignment.create({ menteeId, resourceId });

        res.json({ success: true, message: "Resource assigned successfully" });
    } catch (error) {
        console.error("Error assigning resource:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { getResources, assignResource };
