const express = require('express');
const router = express.Router();
const ParentController = require('../../controller/school-admin/parentController');

router.get('/', ParentController.getParents);
router.post('/', ParentController.createParent);
router.get('/:id', ParentController.getParentById);
router.put('/:id', ParentController.updateParent);
router.put('/:id/status', ParentController.toggleParentStatus);

module.exports = router;
