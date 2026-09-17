const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT_STUDENT_PARENT || 5004;


app.use(cors());
app.use(express.json());


const authRoutes = require('./routes/student_parent/authRoutes');
const profileRoutes = require('./routes/student_parent/profileRoutes');
const dashboardRoutes = require('./routes/student_parent/dashboardRoutes');


app.use('/api/student-parent/auth', authRoutes);
app.use('/api/student-parent/profiles', authMiddleware([4, 5]), profileRoutes);
app.use('/api/student-parent/dashboard', authMiddleware([4, 5]), dashboardRoutes);


app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Student/Parent API', port: PORT });
});


app.listen(PORT, () => {
  console.log(`Student/Parent API server running on port ${PORT}`);
});
