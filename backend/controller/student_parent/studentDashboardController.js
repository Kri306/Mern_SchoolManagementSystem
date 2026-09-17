const StudentDashboardModel = require('../../model/student_parent/studentDashboardModel');

class StudentDashboardController {
  static async resolveStudentContext(req) {
    const id = req.user.id;
    const roleId = req.user.role_id;
    let studentId = id;
    let batchId = req.user.batch_id;
    let schoolId = req.user.school_id;

    if (roleId === 5) {
      const { pool } = require('../../config/db');
      const [rows] = await pool.query(
        'SELECT student_id, batch_id, school_id FROM tbl_students WHERE FIND_IN_SET(?, parent_ids) OR student_parent_details LIKE ? LIMIT 1',
        [id, `%${id}%`]
      );
      if (rows.length > 0) {
        studentId = rows[0].student_id;
        batchId = rows[0].batch_id;
        schoolId = rows[0].school_id;
      }
    }
    return { studentId, batchId, schoolId };
  }

  // Get School
  static async getSchool(req, res) {
    try {
      const { schoolId } = await StudentDashboardController.resolveStudentContext(req);
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID missing' });
      }
      const school = await StudentDashboardModel.getSchool(schoolId);
      res.status(200).json({ success: true, data: school });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get Class
  static async getClass(req, res) {
    try {
      const { batchId } = await StudentDashboardController.resolveStudentContext(req);
      if (!batchId) {
        return res.status(200).json({ success: true, data: null, message: 'No batch assigned to student' });
      }
      const classInfo = await StudentDashboardModel.getClassInfo(batchId);
      res.status(200).json({ success: true, data: classInfo });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get Batch
  static async getBatch(req, res) {
    try {
      const { batchId } = await StudentDashboardController.resolveStudentContext(req);
      if (!batchId) {
        return res.status(200).json({ success: true, data: null, message: 'No batch assigned to student' });
      }
      const batchInfo = await StudentDashboardModel.getBatchInfo(batchId);
      res.status(200).json({ success: true, data: batchInfo });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get Teacher
  static async getTeacher(req, res) {
    try {
      const { batchId } = await StudentDashboardController.resolveStudentContext(req);
      if (!batchId) {
        return res.status(200).json({ success: true, data: null, message: 'No batch assigned to student' });
      }
      const teacherInfo = await StudentDashboardModel.getTeacherInfo(batchId);
      res.status(200).json({ success: true, data: teacherInfo });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get Academic
  static async getAcademic(req, res) {
    try {
      const { schoolId } = await StudentDashboardController.resolveStudentContext(req);
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID missing' });
      }
      const academicInfo = await StudentDashboardModel.getAcademicInfo(schoolId);
      res.status(200).json({ success: true, data: academicInfo });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get Parents
  static async getParents(req, res) {
    try {
      const { studentId } = await StudentDashboardController.resolveStudentContext(req);
      if (!studentId) {
        return res.status(400).json({ success: false, message: 'Student ID missing' });
      }
      const parentInfo = await StudentDashboardModel.getParentInfo(studentId);
      res.status(200).json({ success: true, data: parentInfo });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get Documents
  static async getDocuments(req, res) {
    try {
      const { studentId } = await StudentDashboardController.resolveStudentContext(req);
      if (!studentId) {
        return res.status(400).json({ success: false, message: 'Student ID missing' });
      }
      const docsString = await StudentDashboardModel.getDocuments(studentId);
      
      let documents = [];
      if (docsString) {
        try {
          documents = typeof docsString === 'string' ? JSON.parse(docsString) : docsString;
        } catch (e) {
          console.error('Failed to parse documents JSON', e);
        }
      }
      
      res.status(200).json({ success: true, data: documents });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = StudentDashboardController;
