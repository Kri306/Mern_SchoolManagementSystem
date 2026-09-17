const db = require('../../config/db');

class AuthModel {
  /**
   * Fetch School Admin details by email for login validation
   * @param {string} email 
   * @returns {Promise<Object|null>}
   */
  static async getSchoolAdminByEmail(email) {
    const rows = await db.callSP('sp_school_admin_login', [email]);
    return rows[0] || null;
  }

  /**
   * Register a new school admin in Pending status
   * @param {Object} adminData 
   * @returns {Promise<Object>}
   */
  static async registerSchoolAdmin(adminData) {
    const params = [
      adminData.school_id,
      adminData.name,
      adminData.email,
      adminData.phone_number || null,
      adminData.password
    ];
    return await db.callSP('sp_register_school_admin', params);
  }

  /**
   * Fetch all active schools for dropdown select during self registration
   * @returns {Promise<Array>}
   */
  static async getSchoolsList() {
    return await db.callSP('sp_get_schools');
  }

  /**
   * Log login audit detail in tbl_login_history
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
   */
  static async getLoginHistory(userId) {
    return await db.callSP('sp_get_login_history', [userId]);
  }
}

module.exports = AuthModel;
