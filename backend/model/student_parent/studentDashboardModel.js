const { pool } = require('../../config/db');

class StudentDashboardModel {
  /**
   * Fetch associated school info
   */
  static async getSchool(schoolId) {
    const [rows] = await pool.query(
      'SELECT * FROM tbl_schools WHERE id = ?',
      [schoolId]
    );
    return rows[0] || null;
  }

  /**
   * Fetch class/section info for student's batch
   */
  static async getClassInfo(batchId) {
    const [rows] = await pool.query(
      `SELECT c.class_name, sc.location, sc.student_capacity, sc.status, sec.section_name, sec.room_number
       FROM tbl_batches b
       JOIN tbl_school_classes sc ON b.school_class_id = sc.school_class_id
       JOIN tbl_classes c ON sc.class_id = c.class_id
       JOIN tbl_sections sec ON b.section_id = sec.section_id
       WHERE b.batch_id = ?`,
      [batchId]
    );
    return rows[0] || null;
  }

  /**
   * Fetch details of student's batch
   */
  static async getBatchInfo(batchId) {
    const [rows] = await pool.query(
      `SELECT b.batch_id, b.batch_code, b.start_time, b.end_time, b.duration_minutes, b.status, ay.academic_year_name, m.medium_name
       FROM tbl_batches b
       JOIN tbl_academic_years ay ON b.academic_year_id = ay.academic_year_id
       LEFT JOIN tbl_school_mediums sm ON b.school_medium_id = sm.school_medium_id
       LEFT JOIN tbl_master_mediums m ON sm.master_medium_id = m.master_medium_id
       WHERE b.batch_id = ?`,
      [batchId]
    );
    return rows[0] || null;
  }

  /**
   * Fetch teacher information assigned to student's batch
   */
  static async getTeacherInfo(batchId) {
    const [rows] = await pool.query(
      `SELECT s.id, s.name, s.email, s.phone_number, s.qualification, s.experience, s.status, st.type_name AS staff_type, sd.department_name
       FROM tbl_batches b
       JOIN tbl_staff s ON b.teacher_id = s.id
       LEFT JOIN tbl_staff_types st ON s.staff_type_id = st.id
       LEFT JOIN tbl_staff_departments sd ON s.department_id = sd.id
       WHERE b.batch_id = ?`,
      [batchId]
    );
    return rows[0] || null;
  }

  /**
   * Fetch academic years and sessions for the student's school
   */
  static async getAcademicInfo(schoolId) {
    const [years] = await pool.query(
      'SELECT * FROM tbl_academic_years WHERE school_id = ?',
      [schoolId]
    );

    const [sessions] = await pool.query(
      `SELECT ays.*, ay.academic_year_name 
       FROM tbl_academic_year_sessions ays 
       JOIN tbl_academic_years ay ON ays.academic_year_id = ay.academic_year_id 
       WHERE ay.school_id = ?`,
      [schoolId]
    );

    return {
      years,
      sessions
    };
  }

  /**
   * Fetch parent info linked to the student
   */
  static async getParentInfo(studentId) {
    const [studentRows] = await pool.query(
      'SELECT parent_ids, student_parent_details FROM tbl_students WHERE student_id = ?',
      [studentId]
    );
    if (studentRows.length === 0) return null;
    
    const { parent_ids, student_parent_details } = studentRows[0];
    let parents = [];
    
    if (parent_ids) {
      const ids = parent_ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
      if (ids.length > 0) {
        const [parentRows] = await pool.query(
          'SELECT parent_id AS id, name, email, phone, parent_details FROM tbl_parent WHERE parent_id IN (?)',
          [ids]
        );
        parents = parentRows;
      }
    }
    
    let parsedDetails = null;
    if (student_parent_details) {
      try {
        parsedDetails = typeof student_parent_details === 'string'
          ? JSON.parse(student_parent_details)
          : student_parent_details;
      } catch (e) {
        console.error('Failed to parse student_parent_details', e);
      }
    }
    
    return {
      parents,
      parsedDetails
    };
  }

  /**
   * Fetch documents field of the student
   */
  static async getDocuments(studentId) {
    const [rows] = await pool.query(
      'SELECT documents FROM tbl_students WHERE student_id = ?',
      [studentId]
    );
    return rows[0]?.documents || null;
  }
}

module.exports = StudentDashboardModel;
