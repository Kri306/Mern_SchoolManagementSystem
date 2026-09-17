const express = require('express');
const router = express.Router();
const DashboardController = require('../../controller/school-admin/dashboardController');

// Get dashboard metrics
router.get('/metrics', DashboardController.getMetrics);

module.exports = router;
