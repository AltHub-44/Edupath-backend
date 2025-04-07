const Message = require("../../../models/messageModel");

const getMessages = async (req, res) => {
    try {
        const { menteeId } = req.params;
        const messages = await Message.findAll({
            where: { menteeId, mentorId: req.user.id },
            order: [["createdAt", "ASC"]],
        });

        res.json({ success: true, messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const sendMessage = async (req, res) => {
    try {
        const { menteeId, content } = req.body;

        const newMessage = await Message.create({
            mentorId: req.user.id,
            menteeId,
            content,
        });

        res.json({ success: true, message: newMessage });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { getMessages, sendMessage };
