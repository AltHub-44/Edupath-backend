const axios = require('axios');
const { error, getCache, setCache } = require('../../../utils/helpers')
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
        const data = await getCache(key);
        //if present, return data
        if(data){
            return data;
        }
        // if not present, fetch the api and save the response inthe cache
        data = await setCache(key, JSON.stringify(fetchQuote()), { ex: 24* 60 * 60 });
    return data;
    }
    catch(err){
        error(500, err.message);
    }
}

module.exports = {
    getAndSetCache
};