const express = require('express');
const router = express.Router();
const ProfileController = require('../../controller/student_parent/profileController');

router.get('/', ProfileController.getStudentProfile);
router.post('/change-password', ProfileController.changePassword);

module.exports = router;
