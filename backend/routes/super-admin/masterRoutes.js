const express = require('express');
const router = express.Router();
const MasterController = require('../../controller/super-admin/masterController');

// 1. Dashboard counts
router.get('/dashboard-counts', MasterController.getDashboardCounts);

// 2. Branches
router.get('/branches', MasterController.getBranches);
router.post('/branches', MasterController.createBranch);
router.put('/branches/:id/status', MasterController.toggleBranchStatus);

// 3. School Boards
router.get('/boards', MasterController.getSchoolBoards);
router.post('/boards', MasterController.createSchoolBoard);
router.put('/boards/:id/approve', MasterController.approveSchoolBoard);

// 4. School Mediums
router.get('/mediums', MasterController.getSchoolMediums);
router.post('/mediums', MasterController.createSchoolMedium);
router.put('/mediums/:id/approve', MasterController.approveSchoolMedium);

// 5. Staff
router.get('/staff', MasterController.getStaff);
router.post('/staff', MasterController.createStaff);
router.put('/staff/:id/approve', MasterController.approveStaff);
router.put('/staff/:id/status', MasterController.toggleStaffStatus);

// 6. Students
router.get('/students', MasterController.getStudents);
router.put('/students/:id/status', MasterController.toggleStudentStatus);

// 7. Parents
router.get('/parents', MasterController.getParents);
router.put('/parents/:id/status', MasterController.toggleParentStatus);

// 8. Academic Years
router.get('/academic-years', MasterController.getAcademicYears);
router.post('/academic-years', MasterController.createAcademicYear);
router.put('/academic-years/:id/status', MasterController.toggleAcademicYearStatus);

// 9. Academic Sessions
router.get('/sessions', MasterController.getAcademicSessions);
router.post('/sessions', MasterController.createAcademicSession);
router.put('/sessions/:id/current', MasterController.setCurrentSession);

// 10. Classes
router.get('/classes', MasterController.getClasses);
router.post('/classes', MasterController.createClass);
router.put('/classes/:id/status', MasterController.toggleClassStatus);

// 11. Sections
router.get('/sections', MasterController.getSections);
router.post('/sections', MasterController.createSection);
router.put('/sections/:id/status', MasterController.toggleSectionStatus);

// 12. Batches
router.get('/batches', MasterController.getBatches);
router.post('/batches', MasterController.createBatch);
router.put('/batches/:id/status', MasterController.toggleBatchStatus);

// 13. Staff Types
router.get('/staff-types', MasterController.getStaffTypes);
router.post('/staff-types', MasterController.createStaffType);
router.put('/staff-types/:id/status', MasterController.toggleStaffTypeStatus);

// 14. Departments
router.get('/departments', MasterController.getDepartments);
router.post('/departments', MasterController.createDepartment);
router.put('/departments/:id/status', MasterController.toggleDepartmentStatus);

// 15. Roles
router.get('/roles', MasterController.getRoles);
router.post('/roles', MasterController.createRole);
router.put('/roles/:id/status', MasterController.toggleRoleStatus);

// 16. Modules
router.get('/modules', MasterController.getModules);
router.post('/modules', MasterController.createModule);
router.put('/modules/:id/status', MasterController.toggleModuleStatus);

// 17. Permissions Matrix
router.get('/permissions', MasterController.getPermissionsMatrix);
router.put('/permissions/:id', MasterController.updatePermissionNode);

module.exports = router;
