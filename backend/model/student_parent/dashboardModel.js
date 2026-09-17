const { pool } = require('../../config/db');
const bcrypt = require('bcryptjs');

class DashboardModel {
  /**
   * Get list of children for a parent
   */
  static async getChildrenForParent(parentId) {
    const [children] = await pool.query(
      `SELECT s.student_id, s.user_id, s.name, s.email, s.phone_number,
              s.student_unique_id, s.admission_number, s.gr_number, s.roll_number,
              s.dob, s.gender, s.blood_group, s.gpa, s.student_status, s.status,
              s.batch_id, s.school_id,
              c.class_name, sec.section_name, b.batch_code,
              sch.name AS school_name, sb.branch_name
       FROM tbl_students s
       LEFT JOIN tbl_batches b ON s.batch_id = b.batch_id
       LEFT JOIN tbl_school_classes sc ON b.school_class_id = sc.school_class_id
       LEFT JOIN tbl_classes c ON sc.class_id = c.class_id
       LEFT JOIN tbl_sections sec ON b.section_id = sec.section_id
       LEFT JOIN tbl_schools sch ON s.school_id = sch.id
       LEFT JOIN tbl_school_branches sb ON sc.branch_id = sb.id
       WHERE FIND_IN_SET(?, s.parent_ids) OR s.student_parent_details LIKE ?
       ORDER BY s.student_id ASC`,
      [parentId, `%${parentId}%`]
    );
    return children;
  }

  /**
   * Get single student basic context
   */
  static async getStudentContext(studentId) {
    const [rows] = await pool.query(
      `SELECT s.student_id, s.user_id, s.school_id, s.batch_id, s.name, s.roll_number,
              s.student_unique_id, s.admission_number, s.parent_ids
       FROM tbl_students s
       WHERE s.student_id = ?`,
      [studentId]
    );
    return rows[0] || null;
  }

  /**
   * Get dashboard summary
   */
  static async getSummary(studentId, roleId, parentId) {
    // 1. Get student profile info
    const [sRows] = await pool.query(
      `SELECT s.student_id, s.user_id, s.name, s.email, s.phone_number,
              s.student_unique_id, s.admission_number, s.gr_number, s.roll_number,
              s.dob, s.gender, s.blood_group, s.gpa, s.student_status, s.status,
              s.batch_id, s.school_id, s.parent_ids,
              c.class_name, sec.section_name, sec.room_number,
              b.batch_code, b.start_time, b.end_time, b.duration_minutes,
              st.name AS teacher_name, st.email AS teacher_email, st.phone_number AS teacher_phone,
              st.qualification AS teacher_qualification,
              sch.name AS school_name, sch.logo AS school_logo,
              sb.branch_name, sb.contact_number AS branch_phone,
              ay.academic_year_name, ays.session_name
       FROM tbl_students s
       LEFT JOIN tbl_batches b ON s.batch_id = b.batch_id
       LEFT JOIN tbl_school_classes sc ON b.school_class_id = sc.school_class_id
       LEFT JOIN tbl_classes c ON sc.class_id = c.class_id
       LEFT JOIN tbl_sections sec ON b.section_id = sec.section_id
       LEFT JOIN tbl_staff st ON b.teacher_id = st.id
       LEFT JOIN tbl_schools sch ON s.school_id = sch.id
       LEFT JOIN tbl_school_branches sb ON sc.branch_id = sb.id
       LEFT JOIN tbl_academic_years ay ON b.academic_year_id = ay.academic_year_id
       LEFT JOIN tbl_academic_year_sessions ays ON ay.academic_year_id = ays.academic_year_id AND ays.is_current = 1
       WHERE s.student_id = ?`,
      [studentId]
    );

    const student = sRows[0] || null;

    // 2. Classmates count & snippet
    let classmatesCount = 0;
    let classmatesPreview = [];
    if (student && student.batch_id) {
      const [countRows] = await pool.query(
        'SELECT COUNT(*) AS total FROM tbl_students WHERE batch_id = ? AND status = "Active"',
        [student.batch_id]
      );
      classmatesCount = countRows[0]?.total || 0;

      const [previewRows] = await pool.query(
        `SELECT student_id, name, roll_number, student_unique_id
         FROM tbl_students
         WHERE batch_id = ? AND student_id != ? AND status = "Active"
         ORDER BY roll_number ASC
         LIMIT 6`,
        [student.batch_id, studentId]
      );
      classmatesPreview = previewRows;
    }

    // 3. If parent, also return list of all children for child switcher
    let children = [];
    if (roleId === 5 && parentId) {
      children = await DashboardModel.getChildrenForParent(parentId);
    }

    return {
      student,
      classmatesCount,
      classmatesPreview,
      children
    };
  }

  /**
   * Get full student & parent profile
   */
  static async getFullProfile(studentId) {
    // Student data
    const [sRows] = await pool.query(
      `SELECT s.*,
              c.class_name, sec.section_name, sec.room_number,
              b.batch_code, b.start_time, b.end_time, b.duration_minutes,
              sch.name AS school_name, sch.school_code, sch.email_id AS school_email, sch.contact_number AS school_phone,
              sb.branch_name, sb.branch_code, sb.address AS branch_address, sb.contact_person AS branch_contact_person, sb.contact_number AS branch_contact_number, sb.principal_name,
              ay.academic_year_name,
              sm.custom_medium_name, mm.medium_name,
              sb_board.custom_board_name, mb.board_name
       FROM tbl_students s
       LEFT JOIN tbl_batches b ON s.batch_id = b.batch_id
       LEFT JOIN tbl_school_classes sc ON b.school_class_id = sc.school_class_id
       LEFT JOIN tbl_classes c ON sc.class_id = c.class_id
       LEFT JOIN tbl_sections sec ON b.section_id = sec.section_id
       LEFT JOIN tbl_schools sch ON s.school_id = sch.id
       LEFT JOIN tbl_school_branches sb ON sc.branch_id = sb.id
       LEFT JOIN tbl_academic_years ay ON b.academic_year_id = ay.academic_year_id
       LEFT JOIN tbl_school_mediums sm ON b.school_medium_id = sm.school_medium_id
       LEFT JOIN tbl_master_mediums mm ON sm.master_medium_id = mm.master_medium_id
       LEFT JOIN tbl_school_boards sb_board ON sch.id = sb_board.school_id
       LEFT JOIN tbl_master_school_boards mb ON sb_board.master_board_id = mb.master_board_id
       WHERE s.student_id = ?`,
      [studentId]
    );

    if (sRows.length === 0) return null;
    const student = sRows[0];

    // Linked parent details
    let parents = [];
    if (student.parent_ids) {
      const pids = student.parent_ids
        .split(',')
        .map(id => parseInt(id.trim()))
        .filter(id => !isNaN(id));

      if (pids.length > 0) {
        const [pRows] = await pool.query(
          `SELECT parent_id, name, email, phone, telegram_chat_id, parent_details, status
           FROM tbl_parent
           WHERE parent_id IN (?)`,
          [pids]
        );
        parents = pRows;
      }
    }

    // Parse JSON documents and parent details safely
    let parsedDocuments = [];
    if (student.documents) {
      try {
        parsedDocuments = typeof student.documents === 'string' ? JSON.parse(student.documents) : student.documents;
      } catch (e) {
        parsedDocuments = [];
      }
    }

    return {
      student,
      parents,
      documents: parsedDocuments
    };
  }

  /**
   * Get Class Schedule & Classmates
   */
  static async getClassSchedule(batchId, studentId) {
    if (!batchId) {
      return {
        batch: null,
        classmates: []
      };
    }

    // Batch and class info
    const [bRows] = await pool.query(
      `SELECT b.batch_id, b.batch_code, b.start_time, b.end_time, b.duration_minutes, b.status,
              c.class_name, sec.section_name, sec.room_number,
              sc.location AS class_location, sc.student_capacity,
              ay.academic_year_name,
              mm.medium_name, sm.custom_medium_name,
              mb.board_name, sb.custom_board_name,
              st.name AS teacher_name, st.email AS teacher_email, st.phone_number AS teacher_phone,
              st.qualification AS teacher_qualification, st.office_location AS teacher_office
       FROM tbl_batches b
       LEFT JOIN tbl_school_classes sc ON b.school_class_id = sc.school_class_id
       LEFT JOIN tbl_classes c ON sc.class_id = c.class_id
       LEFT JOIN tbl_sections sec ON b.section_id = sec.section_id
       LEFT JOIN tbl_academic_years ay ON b.academic_year_id = ay.academic_year_id
       LEFT JOIN tbl_school_mediums sm ON b.school_medium_id = sm.school_medium_id
       LEFT JOIN tbl_master_mediums mm ON sm.master_medium_id = mm.master_medium_id
       LEFT JOIN tbl_school_boards sb ON sc.school_id = sb.school_id
       LEFT JOIN tbl_master_school_boards mb ON sb.master_board_id = mb.master_board_id
       LEFT JOIN tbl_staff st ON b.teacher_id = st.id
       WHERE b.batch_id = ?`,
      [batchId]
    );

    // Classmates in the same batch
    const [classmates] = await pool.query(
      `SELECT s.student_id, s.name, s.roll_number, s.admission_number, s.student_unique_id,
              s.email, s.phone_number, s.gender, s.blood_group, s.status, s.student_status
       FROM tbl_students s
       WHERE s.batch_id = ?
       ORDER BY CAST(s.roll_number AS UNSIGNED) ASC, s.name ASC`,
      [batchId]
    );

    return {
      batch: bRows[0] || null,
      classmates
    };
  }

  /**
   * Get Teachers: Class Teacher & Branch Faculty
   */
  static async getTeachers(batchId, schoolId, branchId) {
    let classTeacher = null;
    if (batchId) {
      const [ctRows] = await pool.query(
        `SELECT s.id, s.name, s.email, s.phone_number, s.profile_pic,
                s.qualification, s.experience, s.office_location, s.status,
                stype.type_name AS staff_type, sdept.department_name
         FROM tbl_batches b
         JOIN tbl_staff s ON b.teacher_id = s.id
         LEFT JOIN tbl_staff_types stype ON s.staff_type_id = stype.id
         LEFT JOIN tbl_staff_departments sdept ON s.department_id = sdept.id
         WHERE b.batch_id = ?`,
        [batchId]
      );
      classTeacher = ctRows[0] || null;
    }

    // Branch staff / teachers
    let facultyQuery = `
      SELECT s.id, s.name, s.email, s.phone_number, s.profile_pic,
             s.qualification, s.experience, s.office_location, s.status,
             stype.type_name AS staff_type, sdept.department_name
      FROM tbl_staff s
      LEFT JOIN tbl_staff_types stype ON s.staff_type_id = stype.id
      LEFT JOIN tbl_staff_departments sdept ON s.department_id = sdept.id
      WHERE s.school_id = ? AND s.status = 'Active'
    `;
    const params = [schoolId];
    if (branchId) {
      facultyQuery += ' AND s.branch_id = ?';
      params.push(branchId);
    }
    facultyQuery += ' ORDER BY s.name ASC';

    const [faculty] = await pool.query(facultyQuery, params);

    return {
      classTeacher,
      faculty
    };
  }

  /**
   * Get Academic Year & Sessions
   */
  static async getAcademics(schoolId) {
    // Academic years
    const [years] = await pool.query(
      `SELECT * FROM tbl_academic_years WHERE school_id = ? ORDER BY academic_year_id DESC`,
      [schoolId]
    );

    // Sessions
    const [sessions] = await pool.query(
      `SELECT ays.*, ay.academic_year_name, ay.semester
       FROM tbl_academic_year_sessions ays
       JOIN tbl_academic_years ay ON ays.academic_year_id = ay.academic_year_id
       WHERE ay.school_id = ?
       ORDER BY ays.session_number ASC, ays.start_date ASC`,
      [schoolId]
    );

    // School Mediums
    const [mediums] = await pool.query(
      `SELECT sm.school_medium_id, COALESCE(sm.custom_medium_name, mm.medium_name) AS medium_name, sm.approval_status, sm.status
       FROM tbl_school_mediums sm
       LEFT JOIN tbl_master_mediums mm ON sm.master_medium_id = mm.master_medium_id
       WHERE sm.school_id = ?`,
      [schoolId]
    );

    // School Boards
    const [boards] = await pool.query(
      `SELECT sb.school_board_id, COALESCE(sb.custom_board_name, mb.board_name) AS board_name, sb.request_status, sb.status
       FROM tbl_school_boards sb
       LEFT JOIN tbl_master_school_boards mb ON sb.master_board_id = mb.master_board_id
       WHERE sb.school_id = ?`,
      [schoolId]
    );

    return {
      years,
      sessions,
      mediums,
      boards
    };
  }

  /**
   * Get Student Documents
   */
  static async getDocuments(studentId) {
    const [rows] = await pool.query(
      'SELECT documents FROM tbl_students WHERE student_id = ?',
      [studentId]
    );
    if (!rows[0] || !rows[0].documents) return [];
    try {
      return typeof rows[0].documents === 'string' ? JSON.parse(rows[0].documents) : rows[0].documents;
    } catch (e) {
      return [];
    }
  }

  /**
   * Save / Append Student Documents
   */
  static async saveDocuments(studentId, documentsArray) {
    const jsonStr = JSON.stringify(documentsArray);
    await pool.query(
      'UPDATE tbl_students SET documents = ? WHERE student_id = ?',
      [jsonStr, studentId]
    );
    return documentsArray;
  }

  /**
   * Get School & Branch Profile
   */
  static async getSchoolInfo(schoolId, branchId) {
    const [schoolRows] = await pool.query(
      'SELECT * FROM tbl_schools WHERE id = ?',
      [schoolId]
    );

    let branch = null;
    if (branchId) {
      const [bRows] = await pool.query(
        'SELECT * FROM tbl_school_branches WHERE id = ?',
        [branchId]
      );
      branch = bRows[0] || null;
    } else {
      const [bRows] = await pool.query(
        'SELECT * FROM tbl_school_branches WHERE school_id = ? LIMIT 1',
        [schoolId]
      );
      branch = bRows[0] || null;
    }

    // All branches of this school
    const [allBranches] = await pool.query(
      'SELECT id, branch_name, branch_code, address, contact_person, contact_number, branch_email, principal_name, is_main_branch, status FROM tbl_school_branches WHERE school_id = ?',
      [schoolId]
    );

    return {
      school: schoolRows[0] || null,
      branch,
      allBranches
    };
  }

  /**
   * Get Login Audit History
   */
  static async getLoginHistory(userId) {
    const [rows] = await pool.query(
      `SELECT id, login_time, ip_address, user_agent, status, failure_reason
       FROM tbl_login_history
       WHERE user_id = ?
       ORDER BY login_time DESC
       LIMIT 20`,
      [userId]
    );
    return rows;
  }

  /**
   * Change Password
   */
  static async changePassword(userId, studentOrParentId, roleId, currentPassword, newPassword) {
    // 1. Verify current password
    const [userRows] = await pool.query('SELECT password FROM tbl_users WHERE id = ?', [userId]);
    if (userRows.length === 0) {
      throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(currentPassword, userRows[0].password);
    if (!isMatch) {
      throw new Error('Current password does not match');
    }

    // 2. Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 3. Update tbl_users
    await pool.query('UPDATE tbl_users SET password = ? WHERE id = ?', [hashedPassword, userId]);

    // 4. Update profile table
    if (roleId === 4) {
      await pool.query('UPDATE tbl_students SET password = ? WHERE student_id = ?', [hashedPassword, studentOrParentId]);
    } else if (roleId === 5) {
      await pool.query('UPDATE tbl_parent SET password = ? WHERE parent_id = ?', [hashedPassword, studentOrParentId]);
    }

    return true;
  }
}

module.exports = DashboardModel;
