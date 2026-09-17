const express = require('express');
const router = express.Router();
const StudentController = require('../../controller/staff/studentController');

router.post('/', StudentController.addStudent);
router.get('/', StudentController.getStudents);

module.exports = router;
