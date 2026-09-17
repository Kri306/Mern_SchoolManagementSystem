const express = require('express');
const router = express.Router();
const StudentController = require('../../controller/school-admin/studentController');

router.get('/', StudentController.getStudents);
router.post('/', StudentController.createStudent);
router.get('/:id', StudentController.getStudentById);
router.put('/:id', StudentController.updateStudent);
router.put('/:id/status', StudentController.toggleStudentStatus);

module.exports = router;
