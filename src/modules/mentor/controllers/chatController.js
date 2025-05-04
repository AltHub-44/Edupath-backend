const Message = require('../../../models/messageModel');
const { Op } = require('sequelize');

// Get chat history between mentor and student
const getChatHistory = async (req, res) => {
    try {
        const { studentId } = req.params;
        const mentorId = req.user.id;

        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderId: mentorId, receiverId: studentId },
                    { senderId: studentId, receiverId: mentorId }
                ]
            },
            order: [['createdAt', 'ASC']]
        });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Send a new message
const sendMessage = async (req, res) => {
    try {
        const { receiverId, content, type = 'text', metadata = {} } = req.body;
        const senderId = req.user.id;

        const message = await Message.create({
            senderId,
            receiverId,
            content,
            type,
            metadata
        });

        // Emit message via WebSocket
        req.app.get('io').emit('newMessage', message);

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update message status (delivered/read)
const updateMessageStatus = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { status } = req.body;

        const message = await Message.findByPk(messageId);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        message.status = status;
        await message.save();

        res.json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Edit a message
const editMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { content } = req.body;

        const message = await Message.findByPk(messageId);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        if (message.senderId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to edit this message' });
        }

        message.content = content;
        message.isEdited = true;
        message.editedAt = new Date();
        await message.save();

        res.json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getChatHistory,
    sendMessage,
    updateMessageStatus,
    editMessage
}; 