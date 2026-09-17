const db = require('../../config/db');

class SchoolModel {
  /**
   * Fetch school profile by school ID
   * @param {number} schoolId 
   * @returns {Promise<Object|null>}
   */
  static async getSchoolById(schoolId) {
    const [rows] = await db.pool.query(
      'SELECT id, name, school_code, address, contact_number, email_id, logo, website_link, working_hours, status, bank_details, telegram_channel_id, created_at FROM tbl_schools WHERE id = ?',
      [schoolId]
    );
    return rows[0] || null;
  }

  /**
   * Update school profile information
   * @param {number} schoolId 
   * @param {Object} schoolData 
   * @returns {Promise<Object>}
   */
  static async updateSchool(schoolId, schoolData) {
    const query = `
      UPDATE tbl_schools 
      SET 
        name = ?, 
        school_code = ?, 
        address = ?, 
        contact_number = ?, 
        email_id = ?, 
        logo = ?, 
        website_link = ?, 
        working_hours = ?, 
        bank_details = ?, 
        telegram_channel_id = ?
      WHERE id = ?
    `;
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
      schoolId
    ];
    const [result] = await db.pool.query(query, params);
    return result;
  }
}

module.exports = SchoolModel;
