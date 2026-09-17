const express = require('express');
const router = express.Router();
const ReportController = require('../../controller/school-admin/reportController');

router.get('/student-distribution', ReportController.getStudentDistribution);
router.get('/staff-distribution', ReportController.getStaffDistribution);
router.get('/branch-summary', ReportController.getBranchSummary);

module.exports = router;
