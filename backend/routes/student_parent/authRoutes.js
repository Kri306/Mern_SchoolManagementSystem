const express = require('express');
const router = express.Router();
const AuthController = require('../../controller/student_parent/authController');
const authMiddleware = require('../../middleware/authMiddleware');

// Student/Parent authentication and registration endpoints
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.get('/schools', AuthController.getSchoolsList);
router.get('/branches/:schoolId', AuthController.getBranchesList);

// Login history audit logs
router.get('/login-history', authMiddleware([4, 5]), AuthController.getLoginHistory);

module.exports = router;
