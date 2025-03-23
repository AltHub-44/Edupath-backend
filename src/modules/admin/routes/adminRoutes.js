const express = require('express')

const router = express.Router();

router.get('/', (req, res) => {
    console.log('Welcome to admin');
})

module.exports = router