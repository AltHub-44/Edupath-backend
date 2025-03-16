const axios = require('axios');
const { error, getCache, setCache, getSecondsUntilMidnight } = require('../../../utils/helpers')
const API_URL = process.env.QUOTE_API_URL;

const fetchQuote = async () => {

    try{
        const response = await axios.get(`${API_URL}/random?tags=inspirational`);
        const data = response.data;
        const quote = { content: data.content, author: data.author };
        return quote;
    }
    catch(err){
        error(500, err.message)
    }
}

const getAndSetCache = async (key) => {
    try{
        //check if data is in cache
        const cachedData = await getCache(key);
        const data = cachedData ? JSON.parse(cachedData) : null;

        // If cache exists and is not empty, return it
        if (data && Object.keys(data).length > 0) {
            return data;
        }
        else{
            // if not present, fetch the api and save the response inthe cache
            const quote = await fetchQuote();
            const expiry = getSecondsUntilMidnight();
            await setCache(key, JSON.stringify(quote), { EX: expiry });
            return quote;
        }
    }
    catch(err){
        error(500, err.message);
    }
}

module.exports = {
    getAndSetCache
};