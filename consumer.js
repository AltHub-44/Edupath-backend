const connectRabbitMQ = require("./config/rabbitmq");
const sendEmail = require("./Mailer/services/emailService");

const consumeQueues = async (queues) => {
    const channel = await connectRabbitMQ();

    for (const queue of queues) {
        console.log("📥 Waiting for messages in", queue);

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                try {
                    const data = JSON.parse(msg.content.toString());
                    
                    // Handle different queues accordingly
                    if (queue === "email_queue") {
                        await sendEmail(data);
                    } else {
                        console.log(`Processing ${queue}:`, data);
                    }

                    channel.ack(msg); // Acknowledge message
                } catch (error) {
                    console.error(`Error processing ${queue}:`, error);
                    channel.nack(msg); // Requeue message if failed
                }
            }
        });
    }
};

// Start the consumer with multiple queues
const queuesToConsume = ["email_queue"];
consumeQueues(queuesToConsume);

module.exports = consumeQueues;