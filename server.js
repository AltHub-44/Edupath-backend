const express = require('express')
const cors = require('cors')
const router = require('./router')
const authRoutes = require('./src/modules/auth/routes/authRoutes');
const onboardingRoutes = require('./src/modules/auth/routes/onboardingRoutes');
const dbConnection = require('./src/database/db')
const consumeQueues = require('./consumer');
const mentorRoutes = require("./src/modules/mentors/routes/menteeRoutes");
const scheduleRoutes = require("./src/modules/mentors/routes/scheduleRoutes");
const profileRoutes = require("./src/modules/mentors/routes/profileRoutes");
require('dotenv').config();

const PORT = process.env.PORT

const app = express()

app.use(cors())
app.use(express.json())


app.use('/api', router)
app.use('/api/auth', authRoutes); 
app.use('/api/onboarding', onboardingRoutes); 

app.use("/api/mentor/mentees", mentorRoutes);
app.use("/api/mentor/schedule", scheduleRoutes);
app.use("/api/mentor/profile", profileRoutes);


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

  consumeQueues();

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`)
})