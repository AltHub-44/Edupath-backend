const express = require('express');
const quoteController = require('../controllers/quoteController');

const router = express.Router();

router.get('/', quoteController);

module.exports = router;
