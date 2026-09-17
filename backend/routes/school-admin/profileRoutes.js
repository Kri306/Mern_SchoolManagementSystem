const express = require('express');
const router = express.Router();
const ProfileController = require('../../controller/school-admin/profileController');

router.get('/', ProfileController.getProfile);
router.put('/', ProfileController.updateProfile);
router.put('/change-password', ProfileController.changePassword);

module.exports = router;
