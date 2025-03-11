const { getAndSetCache } = require('../services/quoteService')
const quoteController = async(req, res) => {
    try{
        const key = 'quote';
        const response = await getAndSetCache(key);
        res.status(200).json({ success: true, data: response });
    }
    catch(err){
        res.status(err.status).json({ success: false, message: err.message })
    }
}

module.exports = quoteController