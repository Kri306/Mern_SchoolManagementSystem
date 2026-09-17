const express = require('express');
const router = express.Router();
const AcademicYearController = require('../../controller/school-admin/academicYearController');

// Academic Years CRUD
router.get('/', AcademicYearController.getAcademicYears);
router.post('/', AcademicYearController.createAcademicYear);
router.get('/:id', AcademicYearController.getAcademicYearById);
router.put('/:id', AcademicYearController.updateAcademicYear);
router.put('/:id/current', AcademicYearController.setCurrentYear);

// Sessions sub-routes
router.get('/:yearId/sessions', AcademicYearController.getSessionsByYear);
router.post('/:yearId/sessions', AcademicYearController.createSession);
router.put('/:yearId/sessions/:sessionId', AcademicYearController.updateSession);
router.put('/:yearId/sessions/:sessionId/current', AcademicYearController.setCurrentSession);

module.exports = router;
