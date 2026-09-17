const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT_STAFF || 5003;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/staff/authRoutes');
const studentRoutes = require('./routes/staff/studentRoutes');
const dashboardRoutes = require('./routes/staff/dashboardRoutes');
const { changePassword } = require('./model/staff/dashboardModel');
app.use('/api/staff/auth', authRoutes);
app.use('/api/staff/students', authMiddleware([3]), studentRoutes);
app.use('/api/staff/dashboard', authMiddleware([3]), dashboardRoutes);
 
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Staff API', port: PORT });
});
// Start Server
app.listen(PORT, () => {
  console.log(`Staff API server running on port ${PORT}`);
});


