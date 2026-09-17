const db = require('../../config/db');

class AuthModel {
  /**
   * Fetch Super Admin details by email for login validation
   * @param {string} email 
   * @returns {Promise<Object|null>}
   */
  static async getSuperAdminByEmail(email) {
    const rows = await db.callSP('sp_super_admin_login', [email]);
    return rows[0] || null;
  }
}

module.exports = AuthModel;
