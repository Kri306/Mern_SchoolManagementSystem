const express = require('express');
const router = express.Router();
const DashboardController = require('../../controller/staff/dashboardController');

// All endpoints are protected by role 3 (Staff) auth validation
router.get('/summary', DashboardController.getSummary);
router.get('/profile', DashboardController.getProfile);
router.get('/batches', DashboardController.getBatches);
router.get('/students', DashboardController.getStudents);
router.get('/school-info', DashboardController.getSchoolInfo);
router.get('/academic-years', DashboardController.getAcademicYears);
router.get('/classes-sections', DashboardController.getClassesSections);
router.get('/permissions', DashboardController.getPermissions);
router.post('/change-password', DashboardController.changePassword);

module.exports = router;
