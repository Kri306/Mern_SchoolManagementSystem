const { pool } = require('../../config/db');
const bcrypt = require('bcryptjs');

class DashboardModel {
  /**
   * Get dashboard summary counts and lists
   */
  static async getSummary(teacherId, schoolId, branchId) {
    // 1. Count of Batches
    const [batchesCount] = await pool.query(
      'SELECT COUNT(*) AS count FROM tbl_batches WHERE teacher_id = ?',
      [teacherId]
    );

    // 2. Count of Students
    const [studentsCount] = await pool.query(
      'SELECT COUNT(*) AS count FROM tbl_students s JOIN tbl_batches b ON s.batch_id = b.batch_id WHERE b.teacher_id = ?',
      [teacherId]
    );

    // 3. Current Session
    const [sessions] = await pool.query(
      'SELECT ay.academic_year_name, ays.session_name FROM tbl_academic_year_sessions ays JOIN tbl_academic_years ay ON ays.academic_year_id = ay.academic_year_id WHERE ay.school_id = ? AND ays.is_current = 1 LIMIT 1',
      [schoolId]
    );
    // Fallback if no current session is set
    let sessionName = 'N/A';
    if (sessions.length > 0) {
      sessionName = `${sessions[0].academic_year_name} (${sessions[0].session_name})`;
    } else {
      const [ayFallback] = await pool.query(
        'SELECT academic_year_name FROM tbl_academic_years WHERE school_id = ? AND status = "Active" LIMIT 1',
        [schoolId]
      );
      if (ayFallback.length > 0) {
        sessionName = ayFallback[0].academic_year_name;
      }
    }

    // 4. Branch Name
    const [branches] = await pool.query(
      'SELECT branch_name FROM tbl_school_branches WHERE id = ?',
      [branchId]
    );
    const branchName = branches.length > 0 ? branches[0].branch_name : 'N/A';

    // 5. My Batches List (limit 5)
    const [batchesList] = await pool.query(
      `SELECT b.batch_id, b.batch_code, c.class_name, sec.section_name, b.status
       FROM tbl_batches b
       JOIN tbl_school_classes sc ON b.school_class_id = sc.school_class_id
       JOIN tbl_classes c ON sc.class_id = c.class_id
       JOIN tbl_sections sec ON b.section_id = sec.section_id
       WHERE b.teacher_id = ?
       LIMIT 5`,
      [teacherId]
    );

    // 6. My Students List (limit 5)
    const [studentsList] = await pool.query(
      `SELECT s.student_id AS id, s.name, s.admission_number, c.class_name, b.batch_code
       FROM tbl_students s
       JOIN tbl_batches b ON s.batch_id = b.batch_id
       JOIN tbl_school_classes sc ON b.school_class_id = sc.school_class_id
       JOIN tbl_classes c ON sc.class_id = c.class_id
       WHERE b.teacher_id = ?
       LIMIT 5`,
      [teacherId]
    );

    return {
      counts: {
        batches: batchesCount[0]?.count || 0,
        students: studentsCount[0]?.count || 0,
        session: sessionName,
        branch: branchName
      },
      batches: batchesList,
      students: studentsList
    };
  }

  /**
   * Get full profile details
   */
  static async getProfile(teacherId) {
    const [rows] = await pool.query(
      `SELECT s.*, st.type_name AS staff_type_name, sd.department_name AS department_name, sch.name AS school_name, sb.branch_name AS branch_name
       FROM tbl_staff s
       LEFT JOIN tbl_staff_types st ON s.staff_type_id = st.id
       LEFT JOIN tbl_staff_departments sd ON s.department_id = sd.id
       LEFT JOIN tbl_schools sch ON s.school_id = sch.id
       LEFT JOIN tbl_school_branches sb ON s.branch_id = sb.id
       WHERE s.id = ?`,
      [teacherId]
    );
    return rows[0] || null;
  }

  /**
   * Get all batches for teacher
   */
  static async getBatches(teacherId) {
    const [rows] = await pool.query(
      `SELECT b.batch_id, b.batch_code, c.class_name, sec.section_name, b.status, sc.location, sc.student_capacity, ay.academic_year_name
       FROM tbl_batches b
       JOIN tbl_school_classes sc ON b.school_class_id = sc.school_class_id
       JOIN tbl_classes c ON sc.class_id = c.class_id
       JOIN tbl_sections sec ON b.section_id = sec.section_id
       JOIN tbl_academic_years ay ON b.academic_year_id = ay.academic_year_id
       WHERE b.teacher_id = ?`,
      [teacherId]
    );
    return rows;
  }

  /**
   * Get all students under teacher's batches
   */
  static async getStudents(teacherId) {
    const [rows] = await pool.query(
      `SELECT s.student_id AS id, s.name, s.email, s.phone_number, s.admission_number, s.student_unique_id, s.status, s.student_status, b.batch_code, c.class_name, sec.section_name, s.student_parent_details
       FROM tbl_students s
       JOIN tbl_batches b ON s.batch_id = b.batch_id
       JOIN tbl_school_classes sc ON b.school_class_id = sc.school_class_id
       JOIN tbl_classes c ON sc.class_id = c.class_id
       JOIN tbl_sections sec ON b.section_id = sec.section_id
       WHERE b.teacher_id = ?`,
      [teacherId]
    );
    return rows;
  }

  /**
   * Get school and branch details
   */
  static async getSchoolInfo(schoolId, branchId) {
    const [school] = await pool.query(
      'SELECT * FROM tbl_schools WHERE id = ?',
      [schoolId]
    );
    const [branch] = await pool.query(
      'SELECT * FROM tbl_school_branches WHERE id = ?',
      [branchId]
    );
    return {
      school: school[0] || null,
      branch: branch[0] || null
    };
  }

  /**
   * Get academic years and sessions
   */
  static async getAcademicYears(schoolId) {
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
   * Get classes and sections
   */
  static async getClassesSections(schoolId) {
    const [classes] = await pool.query(
      `SELECT sc.*, c.class_name 
       FROM tbl_school_classes sc 
       JOIN tbl_classes c ON sc.class_id = c.class_id 
       WHERE sc.school_id = ?`,
      [schoolId]
    );

    const [sections] = await pool.query(
      'SELECT * FROM tbl_sections'
    );

    return {
      classes,
      sections
    };
  }

  /**
   * Get permissions for the staff role
   */
  static async getPermissions(roleId) {
    const [rows] = await pool.query(
      `SELECT r.role_name, m.module_name, rm.can_read, rm.can_write, rm.can_update, rm.can_delete, rm.can_more
       FROM tbl_role_module_permissions rm
       JOIN tbl_roles r ON rm.role_id = r.role_id
       JOIN tbl_modules m ON rm.module_id = m.id
       WHERE r.role_id = ?`,
      [roleId]
    );
    return rows;
  }

  /**
   * Change password for the logged-in staff user
   */
  static async changePassword(userId, staffId, newPasswordPlain) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPasswordPlain, salt);

    // Update in tbl_users
    await pool.query(
      'UPDATE tbl_users SET password = ? WHERE id = ?',
      [hashedPassword, userId]
    );

    // Update in tbl_staff
    await pool.query(
      'UPDATE tbl_staff SET password = ? WHERE id = ?',
      [hashedPassword, staffId]
    );

    return true;
  }
}

module.exports = DashboardModel;
