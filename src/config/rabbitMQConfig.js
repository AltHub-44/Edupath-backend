require("dotenv").config();
const amqp = require("amqplib");

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";

const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue("email_queue", { durable: true });
        console.log("✅ Connected to RabbitMQ");
        return channel;
    } catch (error) {
        console.error("❌ RabbitMQ Connection Error:", error.message);
        process.exit(1);
    }
};

module.exports = connectRabbitMQ;