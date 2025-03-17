require("dotenv").config();
const amqp = require("amqplib");

const RABBITMQ_URL = process.env.RABBITMQ_URL;

const sendToQueue = async (emailData) => {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    const queue = "email_queue";

    await channel.assertQueue(queue, { durable: true });

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(emailData)), {
        persistent: true,
    });

    console.log("📩 Email queued:", emailData);
    setTimeout(() => connection.close(), 500);
};

module.exports = sendToQueue