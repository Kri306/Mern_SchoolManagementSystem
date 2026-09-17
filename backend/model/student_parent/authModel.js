const db = require('../../config/db');

class AuthModel {
  /**
   * Fetch Student/Parent details by unique ID (e.g. unique registration/gr code)
   * @param {string} uniqueId 
   * @returns {Promise<Object|null>}
   */
  static async getStudentByUniqueId(uniqueId) {
    const rows = await db.callSP('sp_student_parent_login', [uniqueId]);
    return rows[0] || null;
  }

  /**
   * Fetch user from tbl_users by email for login validation
   */
  static async getUserByEmail(email) {
    const rows = await db.callSP('sp_get_user_by_email', [email]);
    return rows[0] || null;
  }

  /**
   * Fetch Student profile details by user ID
   */
  static async getStudentProfileByUserId(userId) {
    const rows = await db.callSP('sp_get_student_profile_by_userid', [userId]);
    return rows[0] || null;
  }

  /**
   * Fetch Parent profile details by user ID
   */
  static async getParentProfileByUserId(userId) {
    const rows = await db.callSP('sp_get_parent_profile_by_userid', [userId]);
    return rows[0] || null;
  }

  /**
   * Register a new student
   */
  static async registerStudent(studentData) {
    const params = [
      studentData.name,
      studentData.email,
      studentData.phone_number || null,
      studentData.school_id,
      studentData.branch_id,
      studentData.student_unique_id,
      studentData.admission_number,
      studentData.password
    ];
    return await db.callSP('sp_add_student_self', params);
  }

  /**
   * Register a new parent
   */
  static async registerParent(parentData) {
    const params = [
      parentData.name,
      parentData.email,
      parentData.phone_number || null,
      parentData.school_id,
      parentData.branch_id,
      parentData.password
    ];
    return await db.callSP('sp_add_parent_self', params);
  }

  /**
   * Log login audit detail
   */
  static async logLogin(userId, ipAddress, userAgent, status, failureReason) {
    return await db.callSP('sp_add_login_history', [
      userId,
      ipAddress || null,
      userAgent || null,
      status,
      failureReason || null
    ]);
  }

  /**
   * Fetch all schools for registration dropdown
   */
  static async getSchoolsList() {
    return await db.callSP('sp_get_schools');
  }

  /**
   * Fetch branches for school ID
   */
  static async getBranchesList(schoolId) {
    return await db.callSP('sp_get_branches', [schoolId]);
  }

  /**
   * Fetch login history for student/parent user
   */
  static async getLoginHistory(userId) {
    return await db.callSP('sp_get_login_history', [userId]);
  }
}

module.exports = AuthModel;
