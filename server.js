const express = require('express')
const cors = require('cors')
const router = require('./router')
const dbConnection = require('./src/database/db')
const redisClient = require('./src/config/redisConfigs')
require('dotenv').config();

const PORT = process.env.PORT

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', router)

// Test database connection
dbConnection
  .authenticate()
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('Database connection failed:', err));

  // synchronize models
dbConnection
  .sync({ alter: true })
  .then(() => console.log('Models synchronized'))
  .catch((err) => console.error('Model synchronization failed:', err));

redisClient.connect();

app.listen(PORT, () => {
    console.log(`APP is listening on PORT: ${PORT}`)
})