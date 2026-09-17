const express = require('express');
const router = express.Router();
const PermissionController = require('../../controller/school-admin/permissionController');

router.get('/', PermissionController.getPermissionsMatrix);
router.put('/:id', PermissionController.updatePermissionNode);

module.exports = router;
