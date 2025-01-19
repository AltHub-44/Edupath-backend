const express = require('express')
const router = express.Router()
const authRoute = require('./src/modules/auth/routes/authRoutes')

router.get('/', (req, res) => {
    res.status(200).json({message: "Welcome to Edupath Backend, please redirect to /api"})
})

router.use('/auth', authRoute)

module.exports = router