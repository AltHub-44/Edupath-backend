const fetchQuote = require('../services/quoteService')
const quoteController = async(req, res) => {

    //check cache for quote

    //if found, return cached qoute

    //if not found, run fetchQuote and set response into cache then return result
    
    fetchQuote();
}

module.exports = quoteController