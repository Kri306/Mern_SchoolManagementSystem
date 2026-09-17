const express = require('express');
const router = express.Router();
const BatchController = require('../../controller/school-admin/batchController');

router.get('/', BatchController.getBatches);
router.post('/', BatchController.createBatch);
router.get('/:id', BatchController.getBatchById);
router.put('/:id', BatchController.updateBatch);
router.put('/:id/assign-teacher', BatchController.assignTeacher);
router.put('/:id/status', BatchController.toggleBatchStatus);

module.exports = router;
