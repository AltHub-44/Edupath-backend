const connectRabbitMQ = require("./src/config/rabbitMQConfig");
const sendEmail = require("./src/utils/sendEmail");

const consumeQueue = async () => {
    const channel = await connectRabbitMQ();
    const queue = "email_queue";

    console.log("📥 Waiting for messages in", queue);

    channel.consume(queue, async (msg) => {
        if (msg !== null) {
            const emailData = JSON.parse(msg.content.toString());

            try {
                await sendEmail(emailData);
                channel.ack(msg); // Acknowledge message
            } catch (error) {
                channel.nack(msg); // Requeue message if failed
            }
        }
    });
};

module.exports = consumeQueue;