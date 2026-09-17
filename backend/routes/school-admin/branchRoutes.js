const express = require('express');
const router = express.Router();
const BranchController = require('../../controller/school-admin/branchController');

router.post('/', BranchController.createBranch);
router.get('/', BranchController.getBranches);
router.get('/:id', BranchController.getBranchById);
router.put('/:id', BranchController.updateBranch);
router.put('/:id/status', BranchController.toggleBranchStatus);

module.exports = router;
