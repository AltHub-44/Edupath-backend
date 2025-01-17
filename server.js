const express = require('express')
const cors = require('cors')
const { dbConnection } = require('./src/database/db')
require('dotenv').config();

const PORT = process.env.PORT

const app = express()
app.use(cors())
app.use(express.json())
dbConnection()

app.get('/api', (req, res) => {
    res.status(200).json({message: "Welcome to Edupath Backend"})
})

app.listen(PORT, () => {
    console.log(`APP is listening on PORT: ${PORT}`)
})