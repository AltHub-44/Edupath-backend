const mentorDashboardRoutes = require('../modules/mentor/routes/dashboardRoutes');
const mentorMenteeRoutes = require('../modules/mentor/routes/menteeRoutes');
const mentorSessionRoutes = require('../modules/mentor/routes/sessionRoutes');

// Mentor Dashboard Routes
app.use('/api/mentor/dashboard', mentorDashboardRoutes);

// Mentor Mentee Management Routes
app.use('/api/mentor/mentees', mentorMenteeRoutes);

// Mentor Session Management Routes
app.use('/api/mentor/sessions', mentorSessionRoutes); 