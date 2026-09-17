const express = require('express');
const router = express.Router();
const ClassController = require('../../controller/school-admin/classController');

// Global Class Master
router.get('/master', ClassController.getMasterClasses);
router.post('/master', ClassController.createMasterClass);

// School & Branch Class Associations
router.get('/', ClassController.getSchoolClasses);
router.post('/', ClassController.assignClassToBranch);
router.get('/:id', ClassController.getSchoolClassById);
router.put('/:id', ClassController.updateSchoolClass);
router.put('/:id/status', ClassController.toggleClassStatus);

module.exports = router;
