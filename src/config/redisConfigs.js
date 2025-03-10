const Redis = require('redis');
require('dotenv').config();
const REDIS_URL = process.env.REDIS_URL

    const client = Redis.createClient(REDIS_URL);
    try{
        client.on('connect', () => {
            console.log("redis connection successful");
        })
        client.on('error', () => {
            console.log(error);
        })
    }
    catch(error){
        console.log(error.message);
    }

module.exports = client

