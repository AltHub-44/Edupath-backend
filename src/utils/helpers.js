//helper functions and utils
const redisClient = require('../config/redisConfigs')
const error = (code, message) => {
    const error = new Error(message)
    error.statusCode = code
    throw error
}

//setting data to cache
const setCache = async (key, data, expiry) => {
    const response = await redisClient.set(key, JSON.stringify(data), { EX: `${expiry}`});
    return response

}
//getting cached data
const getCache = async (key) => {
    const data = await redisClient.get(key);
    return JSON.parse(data);
}

module.exports = {
    error,
    getCache,
    setCache
}