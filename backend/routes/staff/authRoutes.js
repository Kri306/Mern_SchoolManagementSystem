const express = require('express');
const router = express.Router();
const AuthController = require('../../controller/staff/authController');
const authMiddleware = require('../../middleware/authMiddleware');

// Staff login and registration endpoints
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.get('/schools', AuthController.getSchoolsList);
router.get('/branches/:schoolId', AuthController.getBranchesList);
router.get('/types', AuthController.getStaffTypesList);
router.get('/departments', AuthController.getDepartmentsList);

// Get login history endpoint
router.get('/login-history', authMiddleware([3]), AuthController.getLoginHistory);

module.exports = router;
