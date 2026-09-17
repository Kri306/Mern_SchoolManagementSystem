const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT_SUPER_ADMIN || 5001;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/super-admin/authRoutes');
const schoolRoutes = require('./routes/super-admin/schoolRoutes');
const masterRoutes = require('./routes/super-admin/masterRoutes');

app.use('/api/super-admin/auth', authRoutes);
app.use('/api/super-admin/schools', authMiddleware([1]), schoolRoutes);
app.use('/api/super-admin/master', authMiddleware([1]), masterRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Super Admin API', port: PORT });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Super Admin API server running on port ${PORT}`);
});
