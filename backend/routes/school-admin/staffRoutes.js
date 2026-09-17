const express = require('express');
const router = express.Router();
const StaffController = require('../../controller/school-admin/staffController');

router.get('/types', StaffController.getStaffTypes);
router.get('/departments', StaffController.getStaffDepartments);

router.post('/', StaffController.createStaff);
router.get('/', StaffController.getStaff);
router.get('/:id', StaffController.getStaffById);
router.put('/:id', StaffController.updateStaff);
router.put('/:id/status', StaffController.toggleStaffStatus);

module.exports = router;
