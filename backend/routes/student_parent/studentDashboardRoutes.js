const express = require('express');
const router = express.Router();
const StudentDashboardController = require('../../controller/student_parent/studentDashboardController');

router.get('/school', StudentDashboardController.getSchool);
router.get('/class', StudentDashboardController.getClass);
router.get('/batch', StudentDashboardController.getBatch);
router.get('/teacher', StudentDashboardController.getTeacher);
router.get('/academic', StudentDashboardController.getAcademic);
router.get('/parents', StudentDashboardController.getParents);
router.get('/documents', StudentDashboardController.getDocuments);

module.exports = router;
