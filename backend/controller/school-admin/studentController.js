const StudentModel = require('../../model/school-admin/studentModel');

class StudentController {
  // Get all students for a school
  static async getStudents(req, res) {
    try {
      const schoolId = req.user.school_id;
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }
      const students = await StudentModel.getStudents(schoolId);
      res.status(200).json({
        success: true,
        data: students
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get student by ID
  static async getStudentById(req, res) {
    try {
      const schoolId = req.user.school_id;
      const studentId = parseInt(req.params.id, 10);
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }
      const student = await StudentModel.getStudentById(schoolId, studentId);
      if (!student) {
        return res.status(404).json({ success: false, message: 'Student not found' });
      }
      res.status(200).json({
        success: true,
        data: student
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Create Student
  static async createStudent(req, res) {
    try {
      const schoolId = req.user.school_id;
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }
      const studentData = {
        ...req.body,
        created_by: req.user.id
      };

      if (!studentData.student_unique_id || !studentData.admission_number || !studentData.name) {
        return res.status(400).json({
          success: false,
          message: 'Student Unique ID, Admission Number, and Name are required'
        });
      }

      const result = await StudentModel.createStudent(schoolId, studentData);
      res.status(201).json({
        success: true,
        message: 'Student registered successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update Student
  static async updateStudent(req, res) {
    try {
      const schoolId = req.user.school_id;
      const studentId = parseInt(req.params.id, 10);
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }
      const studentData = req.body;

      if (!studentData.admission_number || !studentData.name) {
        return res.status(400).json({
          success: false,
          message: 'Admission Number and Name are required'
        });
      }

      await StudentModel.updateStudent(schoolId, studentId, studentData);
      res.status(200).json({
        success: true,
        message: 'Student profile updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Toggle Student Status
  static async toggleStudentStatus(req, res) {
    try {
      const schoolId = req.user.school_id;
      const studentId = parseInt(req.params.id, 10);
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }
      const newStatus = await StudentModel.toggleStudentStatus(schoolId, studentId);
      res.status(200).json({
        success: true,
        message: `Student status updated to ${newStatus}`,
        data: { status: newStatus }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = StudentController;
