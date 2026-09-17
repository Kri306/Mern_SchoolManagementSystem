const db = require('../../config/db');
const bcrypt = require('bcryptjs');

class SchoolModel {
  /**
   * Create a new school using stored procedure sp_add_school
   */
  static async createSchool(schoolData) {
    const params = [
      schoolData.name,
      schoolData.school_code,
      schoolData.address || null,
      schoolData.contact_number || null,
      schoolData.email_id || null,
      schoolData.logo || null,
      schoolData.website_link || null,
      schoolData.working_hours || null,
      schoolData.bank_details || null,
      schoolData.telegram_channel_id || null,
      schoolData.created_by || null
    ];
    return await db.callSP('sp_add_school', params);
  }

  /**
   * Fetch all schools using stored procedure sp_get_schools
   */
  static async getAllSchools() {
    return await db.callSP('sp_get_schools');
  }

  /**
   * Create a new school admin using stored procedure sp_add_school_admin
   */
  static async createSchoolAdmin(adminData) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    const params = [
      adminData.school_id,
      adminData.name,
      adminData.email,
      adminData.phone_number || null,
      hashedPassword,
      adminData.created_by || null
    ];
    return await db.callSP('sp_add_school_admin', params);
  }

  /**
   * Fetch all school admins using stored procedure sp_get_school_admins
   */
  static async getSchoolAdmins() {
    return await db.callSP('sp_get_school_admins');
  }

  /**
   * Update the registration status of a school admin
   */
  static async approveSchoolAdmin(adminId, status, approvedBy) {
    return await db.callSP('sp_approve_school_admin', [adminId, status, approvedBy]);
  }
}

module.exports = SchoolModel;
