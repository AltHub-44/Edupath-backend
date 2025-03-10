const axios = require('axios');
const { error } = require('../../../utils/helpers')
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

module.exports = fetchQuote;