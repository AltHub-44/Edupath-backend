const Redis = require('redis');
require('dotenv').config();

const client = Redis.createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

const connectRedis = async () => {
    try {
        client.on('connect', () => {
            console.log("✅ Redis connection successful");
        });

        client.on('error', (err) => {
            console.error("❌ Redis Client Error:", err.message);
        });

        await client.connect(); // Ensures connection before usage
    } catch (error) {
        console.error("❌ Redis connection failed:", error.message);
    }
};

// Call the connection function
connectRedis();

module.exports = client;
