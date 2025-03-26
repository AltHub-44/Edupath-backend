//helper functions and utils
const redisClient = require('../config/redisConfigs')
const { randomBytes } = require("crypto");
const error = (code, message) => {
    const error = new Error(message)
    error.statusCode = code
    throw error
}

//setting data to cache
const setCache = async (key, data, expiry) => {
    const response = await redisClient.set(key, JSON.stringify(data), expiry);
    return response

}
//getting cached data
const getCache = async (key) => {
    const data = await redisClient.get(key);
    return JSON.parse(data);
}

const getSecondsUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(23, 59, 59, 999);
    return Math.floor((midnight - now) / 1000)
}

const generateRandomPassword = () => {
    const minLength = 6;
    const maxLength = 30;
    const randomLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength; 
    return randomBytes(randomLength).toString("hex").slice(0, randomLength);
};


module.exports = {
    error,
    getCache,
    setCache,
    getSecondsUntilMidnight,
    generateRandomPassword
}