const express = require('express');
const router = express.Router();
const RequestController = require('../../controller/school-admin/requestController');

router.get('/', RequestController.getRequests);

module.exports = router;
