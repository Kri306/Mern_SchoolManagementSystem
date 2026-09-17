const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT_SCHOOL_ADMIN || 5002;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/school-admin/authRoutes');
const branchRoutes = require('./routes/school-admin/branchRoutes');
const staffRoutes = require('./routes/school-admin/staffRoutes');
const dashboardRoutes = require('./routes/school-admin/dashboardRoutes');
const schoolRoutes = require('./routes/school-admin/schoolRoutes');
const studentRoutes = require('./routes/school-admin/studentRoutes');
const academicYearRoutes = require('./routes/school-admin/academicYearRoutes');
const classRoutes = require('./routes/school-admin/classRoutes');
const sectionRoutes = require('./routes/school-admin/sectionRoutes');
const batchRoutes = require('./routes/school-admin/batchRoutes');
const mediumRoutes = require('./routes/school-admin/mediumRoutes');
const boardRoutes = require('./routes/school-admin/boardRoutes');
const parentRoutes = require('./routes/school-admin/parentRoutes');
const requestRoutes = require('./routes/school-admin/requestRoutes');
const profileRoutes = require('./routes/school-admin/profileRoutes');
const permissionRoutes = require('./routes/school-admin/permissionRoutes');
const reportRoutes = require('./routes/school-admin/reportRoutes');

app.use('/api/school-admin/auth', authRoutes);
app.use('/api/school-admin/branches', authMiddleware([2]), branchRoutes);
app.use('/api/school-admin/staff', authMiddleware([2]), staffRoutes);
app.use('/api/school-admin/dashboard', authMiddleware([2]), dashboardRoutes);
app.use('/api/school-admin/school', authMiddleware([2]), schoolRoutes);
app.use('/api/school-admin/students', authMiddleware([2]), studentRoutes);
app.use('/api/school-admin/academic-years', authMiddleware([2]), academicYearRoutes);
app.use('/api/school-admin/classes', authMiddleware([2]), classRoutes);
app.use('/api/school-admin/sections', authMiddleware([2]), sectionRoutes);
app.use('/api/school-admin/batches', authMiddleware([2]), batchRoutes);
app.use('/api/school-admin/mediums', authMiddleware([2]), mediumRoutes);
app.use('/api/school-admin/boards', authMiddleware([2]), boardRoutes);
app.use('/api/school-admin/parents', authMiddleware([2]), parentRoutes);
app.use('/api/school-admin/requests', authMiddleware([2]), requestRoutes);
app.use('/api/school-admin/profile', authMiddleware([2]), profileRoutes);
app.use('/api/school-admin/permissions', authMiddleware([2]), permissionRoutes);
app.use('/api/school-admin/reports', authMiddleware([2]), reportRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'School Admin API', port: PORT });
});

// Start Server
app.listen(PORT, () => {
  console.log(`School Admin API server running on port ${PORT}`);
});
