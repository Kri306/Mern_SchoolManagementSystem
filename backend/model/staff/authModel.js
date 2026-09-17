const db = require('../../config/db');

class AuthModel {
  /**
   * Fetch Staff details by email for login validation
   * @param {string} email 
   * @returns {Promise<Object|null>}
   */
  static async getStaffByEmail(email) {
    const rows = await db.callSP('sp_staff_login', [email]);
    return rows[0] || null;
  }

  /**
   * Log login audit detail in tbl_login_history
   * @param {number} userId 
   * @param {string} ipAddress 
   * @param {string} userAgent 
   * @param {string} status 
   * @param {string|null} failureReason 
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
   * Fetch login history for a specific user ID
   * @param {number} userId 
   * @returns {Promise<Array>}
   */
  static async getLoginHistory(userId) {
    return await db.callSP('sp_get_login_history', [userId]);
  }

  /**
   * Register a new staff member
   */
  static async registerStaff(staffData) {
    const params = [
      staffData.name,
      staffData.email,
      staffData.phone_number || null,
      staffData.school_id,
      staffData.branch_id,
      staffData.staff_type_id || null,
      staffData.custom_staff_type || null,
      staffData.department_id || null,
      staffData.custom_staff_department || null,
      staffData.password,
      null // created_by
    ];
    return await db.callSP('sp_add_staff', params);
  }

  /**
   * Fetch all schools for registration dropdown
   */
  static async getSchoolsList() {
    return await db.callSP('sp_get_schools');
  }

  /**
   * Fetch branches for a specific school ID
   */
  static async getBranchesList(schoolId) {
    return await db.callSP('sp_get_branches', [schoolId]);
  }

  /**
   * Fetch staff types for registration dropdown
   */
  static async getStaffTypesList() {
    return await db.callSP('sp_get_staff_types');
  }

  /**
   * Fetch departments for registration dropdown
   */
  static async getDepartmentsList() {
    return await db.callSP('sp_get_staff_departments');
  }
}

module.exports = AuthModel;
