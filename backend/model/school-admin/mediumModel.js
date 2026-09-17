const db = require('../../config/db');

class MediumModel {
  /**
   * Fetch all mediums assigned to a specific school
   */
  static async getSchoolMediums(schoolId) {
    const query = `
      SELECT sm.*, mm.medium_name, mm.description 
      FROM tbl_school_mediums sm 
      JOIN tbl_master_mediums mm ON sm.master_medium_id = mm.master_medium_id 
      WHERE sm.school_id = ?
      ORDER BY sm.school_medium_id DESC
    `;
    const [rows] = await db.pool.query(query, [schoolId]);
    return rows;
  }

  /**
   * Fetch master mediums list that can be requested or linked
   */
  static async getMasterMediums(schoolId) {
    const query = `
      SELECT * FROM tbl_master_mediums 
      WHERE status = 'Active' 
        AND (requested_by_school_id IS NULL OR requested_by_school_id = ? OR approval_status = 'Approved')
      ORDER BY master_medium_id DESC
    `;
    const [rows] = await db.pool.query(query, [schoolId]);
    return rows;
  }

  /**
   * Request association with an existing master medium
   */
  static async requestExistingMedium(schoolId, masterMediumId, customName = null) {
    // Check if already linked
    const [check] = await db.pool.query(
      'SELECT school_medium_id FROM tbl_school_mediums WHERE school_id = ? AND master_medium_id = ?',
      [schoolId, masterMediumId]
    );
    if (check.length > 0) throw new Error('Medium association already exists or is pending');

    const query = `
      INSERT INTO tbl_school_mediums (school_id, master_medium_id, custom_medium_name, approval_status, status)
      VALUES (?, ?, ?, 'Pending', 'Active')
    `;
    const [result] = await db.pool.query(query, [schoolId, masterMediumId, customName]);
    return { school_medium_id: result.insertId };
  }

  /**
   * Request a new custom medium (creates global master medium record in Pending status and associates it)
   */
  static async requestCustomMedium(schoolId, name, description) {
    // 1. Insert into tbl_master_mediums
    const [masterResult] = await db.pool.query(
      `INSERT INTO tbl_master_mediums (medium_name, description, requested_by_school_id, approval_status, status)
       VALUES (?, ?, ?, 'Pending', 'Active')`,
      [name, description || null, schoolId]
    );
    
    const masterMediumId = masterResult.insertId;

    // 2. Associate with school in tbl_school_mediums
    const [assocResult] = await db.pool.query(
      `INSERT INTO tbl_school_mediums (school_id, master_medium_id, custom_medium_name, approval_status, status)
       VALUES (?, ?, ?, 'Pending', 'Active')`,
      [schoolId, masterMediumId, name]
    );

    return {
      master_medium_id: masterMediumId,
      school_medium_id: assocResult.insertId
    };
  }

  /**
   * Toggle school medium status
   */
  static async toggleMediumStatus(schoolId, schoolMediumId) {
    const [rows] = await db.pool.query(
      'SELECT status FROM tbl_school_mediums WHERE school_medium_id = ? AND school_id = ?',
      [schoolMediumId, schoolId]
    );
    if (rows.length === 0) throw new Error('School medium association not found');

    const newStatus = rows[0].status === 'Active' ? 'Inactive' : 'Active';
    await db.pool.query(
      'UPDATE tbl_school_mediums SET status = ? WHERE school_medium_id = ? AND school_id = ?',
      [newStatus, schoolMediumId, schoolId]
    );
    return newStatus;
  }
}

module.exports = MediumModel;
