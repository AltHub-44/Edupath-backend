const express = require('express')
const router = express.Router()
const authRoute = require('./src/modules/auth/routes/authRoutes')
const quoteRouter = require('./src/modules/quote/routes/quoteRoute')
const adminRoute = require('./src/modules/admin/routes/adminRoutes')
const studentRoute = require('./src/modules/student/routes/studentRoutes')
const chatRoutes = require('./modules/mentor/routes/chatRoutes');

router.get('/', (req, res) => {
    res.status(200).json({message: "Welcome to Edupath Backend, please redirect to /api"})
})

router.use('/auth', authRoute)
router.use('/quote', quoteRouter)
router.use('/admin', adminRoute)
router.use('/student', studentRoute)
app.use('/api/chat', chatRoutes);

module.exports = router