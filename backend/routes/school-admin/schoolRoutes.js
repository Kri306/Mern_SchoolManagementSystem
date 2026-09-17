const express = require('express');
const router = express.Router();
const SchoolController = require('../../controller/school-admin/schoolController');

router.get('/', SchoolController.getSchoolProfile);
router.put('/', SchoolController.updateSchoolProfile);

module.exports = router;
