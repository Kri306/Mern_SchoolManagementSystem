const express = require('express');
const router = express.Router();
const MediumController = require('../../controller/school-admin/mediumController');

router.get('/', MediumController.getSchoolMediums);
router.get('/master', MediumController.getMasterMediums);
router.post('/request', MediumController.requestMedium);
router.put('/:id/status', MediumController.toggleMediumStatus);

module.exports = router;
