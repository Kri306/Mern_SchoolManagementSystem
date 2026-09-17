const db = require('../../config/db');

class StudentModel {
  /**
   * Add a new student
   */
  static async addStudent(studentData) {
    const params = [
      studentData.school_id,
      studentData.student_unique_id,
      studentData.admission_number,
      studentData.name,
      studentData.email || null,
      studentData.phone_number || null,
      studentData.batch_id || null,
      studentData.created_by || null
    ];
    return await db.callSP('sp_add_student', params);
  }

  /**
   * Get all students in a school
   */
  static async getStudents(schoolId) {
    return await db.callSP('sp_get_students', [schoolId]);
  }
}

module.exports = StudentModel;
