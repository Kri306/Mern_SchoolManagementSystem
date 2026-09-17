const db = require('../../config/db');

class SectionModel {
  /**
   * Fetch all sections
   */
  static async getSections() {
    return await db.callSP('sp_get_sections');
  }

  /**
   * Fetch a single section by ID
   */
  static async getSectionById(sectionId) {
    const [rows] = await db.pool.query(
      'SELECT * FROM tbl_sections WHERE section_id = ?',
      [sectionId]
    );
    return rows[0] || null;
  }

  /**
   * Create a section using stored procedure
   */
  static async createSection(sectionData) {
    const params = [
      sectionData.section_name,
      sectionData.room_number || null,
      sectionData.created_by
    ];
    return await db.callSP('sp_add_section', params);
  }

  /**
   * Update section details
   */
  static async updateSection(sectionId, sectionData) {
    const query = `
      UPDATE tbl_sections 
      SET 
        section_name = ?, 
        room_number = ?, 
        status = ?
      WHERE section_id = ?
    `;
    const params = [
      sectionData.section_name,
      sectionData.room_number || null,
      sectionData.status || 'Active',
      sectionId
    ];
    const [result] = await db.pool.query(query, params);
    return result;
  }

  /**
   * Toggle section status between Active and Inactive
   */
  static async toggleSectionStatus(sectionId) {
    const [rows] = await db.pool.query(
      'SELECT status FROM tbl_sections WHERE section_id = ?',
      [sectionId]
    );
    if (rows.length === 0) throw new Error('Section not found');

    const newStatus = rows[0].status === 'Active' ? 'Inactive' : 'Active';
    await db.pool.query(
      'UPDATE tbl_sections SET status = ? WHERE section_id = ?',
      [newStatus, sectionId]
    );
    return newStatus;
  }
}

module.exports = SectionModel;
