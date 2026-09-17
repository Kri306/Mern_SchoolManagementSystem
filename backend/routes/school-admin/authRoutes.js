const express = require('express');
const router = express.Router();
const AuthController = require('../../controller/school-admin/authController');
const authMiddleware = require('../../middleware/authMiddleware');

// School Admin login and registration endpoints
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.get('/schools', AuthController.getSchoolsList);

// Get login history
router.get('/login-history', authMiddleware([2]), AuthController.getLoginHistory);

module.exports = router;
