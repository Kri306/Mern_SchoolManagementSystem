const express = require('express');
const router = express.Router();
const SectionController = require('../../controller/school-admin/sectionController');

router.get('/', SectionController.getSections);
router.post('/', SectionController.createSection);
router.get('/:id', SectionController.getSectionById);
router.put('/:id', SectionController.updateSection);
router.put('/:id/status', SectionController.toggleSectionStatus);

module.exports = router;
