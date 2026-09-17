const StudentModel = require('../../model/staff/studentModel');

class StudentController {
  // Add Student
  static async addStudent(req, res) {
    try {
      const result = await StudentModel.addStudent(req.body);
      res.status(201).json({
        success: true,
        message: 'Student added successfully by staff member',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get Students
  static async getStudents(req, res) {
    try {
      const { schoolId } = req.query;
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID is required' });
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
}

module.exports = StudentController;
