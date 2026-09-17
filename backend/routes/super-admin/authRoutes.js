const express = require('express');
const router = express.Router();
const AuthController = require('../../controller/super-admin/authController');

// Super Admin login endpoint
router.post('/login', AuthController.login);

module.exports = router;
