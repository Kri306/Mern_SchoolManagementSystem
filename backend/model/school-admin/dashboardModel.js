const db = require('../../config/db');

class DashboardModel {
  /**
   * Fetch aggregate statistics and current session details for a specific school ID
   * @param {number} schoolId 
   * @returns {Promise<Object>}
   */
  static async getDashboardMetrics(schoolId) {
    const [studentsResult] = await db.pool.query(
      'SELECT COUNT(*) as count FROM tbl_students WHERE school_id = ?',
      [schoolId]
    );

    const [staffResult] = await db.pool.query(
      'SELECT COUNT(*) as count FROM tbl_staff WHERE school_id = ?',
      [schoolId]
    );

    const [branchesResult] = await db.pool.query(
      'SELECT COUNT(*) as count FROM tbl_school_branches WHERE school_id = ?',
      [schoolId]
    );

    const [classesResult] = await db.pool.query(
      'SELECT COUNT(*) as count FROM tbl_school_classes WHERE school_id = ?',
      [schoolId]
    );

    const [academicYearResult] = await db.pool.query(
      'SELECT academic_year_name FROM tbl_academic_years WHERE school_id = ? AND is_current = 1 LIMIT 1',
      [schoolId]
    );

    const [batchesResult] = await db.pool.query(
      'SELECT COUNT(*) as count FROM tbl_batches b JOIN tbl_school_classes sc ON b.school_class_id = sc.school_class_id WHERE sc.school_id = ? AND b.status = "Active"',
      [schoolId]
    );

    return {
      totalStudents: studentsResult[0]?.count || 0,
      totalStaff: staffResult[0]?.count || 0,
      totalBranches: branchesResult[0]?.count || 0,
      totalClasses: classesResult[0]?.count || 0,
      currentAcademicYear: academicYearResult[0]?.academic_year_name || 'Not Configured',
      activeBatches: batchesResult[0]?.count || 0
    };
  }
}

module.exports = DashboardModel;
