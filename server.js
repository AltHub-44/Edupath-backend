const express = require('express')
const cors = require('cors')
const router = require('./router')
const authRoutes = require('./src/modules/auth/routes/authRoutes');
const onboardingRoutes = require('./src/modules/auth/routes/onboardingRoutes');
const chatRoutes = require('./src/modules/mentor/routes/chatRoutes');
const assignmentRoutes = require('./src/modules/mentor/routes/assignmentRoutes');
const dbConnection = require('./src/database/db')
const consumeQueues = require('./consumer');
const websocketService = require('./src/services/websocketService');
const http = require('http');
require('dotenv').config();

const PORT = process.env.PORT || 8000;

const app = express()
const server = http.createServer(app);

// Initialize WebSocket
websocketService.initialize(server);

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/api', router)
app.use('/api/auth', authRoutes); 
app.use('/api/onboarding', onboardingRoutes); 
app.use('/api/chat', chatRoutes);
app.use('/api/assignments', assignmentRoutes);

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})