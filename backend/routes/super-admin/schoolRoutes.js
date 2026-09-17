const express = require('express');
const router = express.Router();
const SchoolController = require('../../controller/super-admin/schoolController');

router.post('/', SchoolController.createSchool);
router.get('/', SchoolController.getAllSchools);
router.post('/admins', SchoolController.createSchoolAdmin);
router.get('/admins', SchoolController.getSchoolAdmins);
router.put('/admins/:id/approve', SchoolController.approveSchoolAdmin);

module.exports = router;
