const db = require('../../config/db');

class ReportModel {
  /**
   * Fetch student distribution count grouped by class levels
   */
  static async getStudentDistributionByClass(schoolId) {
    const query = `
      SELECT c.class_name, COUNT(s.student_id) as student_count 
      FROM tbl_students s 
      JOIN tbl_batches b ON s.batch_id = b.batch_id
      JOIN tbl_school_classes sc ON b.school_class_id = sc.school_class_id
      JOIN tbl_classes c ON sc.class_id = c.class_id
      WHERE s.school_id = ?
      GROUP BY c.class_id, c.class_name, c.display_order
      ORDER BY c.display_order ASC
    `;
    const [rows] = await db.pool.query(query, [schoolId]);
    return rows;
  }

  /**
   * Fetch staff count grouped by department
   */
  static async getStaffDistributionByDepartment(schoolId) {
    const query = `
      SELECT COALESCE(sd.department_name, s.custom_staff_department, 'Unassigned') as department_name, 
             COUNT(s.id) as staff_count 
      FROM tbl_staff s 
      LEFT JOIN tbl_staff_departments sd ON s.department_id = sd.id
      WHERE s.school_id = ?
      GROUP BY sd.id, sd.department_name, s.custom_staff_department
    `;
    const [rows] = await db.pool.query(query, [schoolId]);
    return rows;
  }

  /**
   * Fetch aggregate class, staff, and student summary grouped by school branches
   */
  static async getBranchSummary(schoolId) {
    const query = `
      SELECT sb.id as branch_id, sb.branch_name, sb.branch_code, 
             (SELECT COUNT(*) FROM tbl_staff WHERE branch_id = sb.id) as staff_count,
             (SELECT COUNT(*) FROM tbl_students s JOIN tbl_batches b ON s.batch_id = b.batch_id 
              JOIN tbl_school_classes sc ON b.school_class_id = sc.school_class_id WHERE sc.branch_id = sb.id) as student_count
      FROM tbl_school_branches sb
      WHERE sb.school_id = ?
    `;
    const [rows] = await db.pool.query(query, [schoolId]);
    return rows;
  }
}

module.exports = ReportModel;
