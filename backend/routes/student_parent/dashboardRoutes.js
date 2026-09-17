const express = require('express');
const router = express.Router();
const DashboardController = require('../../controller/student_parent/dashboardController');

// Main Student & Parent Dashboard routes
router.get('/children', DashboardController.getChildren);
router.get('/summary', DashboardController.getSummary);
router.get('/profile', DashboardController.getProfile);
router.get('/schedule', DashboardController.getSchedule);
router.get('/teachers', DashboardController.getTeachers);
router.get('/academics', DashboardController.getAcademics);
router.get('/documents', DashboardController.getDocuments);
router.post('/documents', DashboardController.saveDocuments);
router.get('/school-info', DashboardController.getSchoolInfo);
router.get('/login-history', DashboardController.getLoginHistory);
router.post('/change-password', DashboardController.changePassword);

module.exports = router;
