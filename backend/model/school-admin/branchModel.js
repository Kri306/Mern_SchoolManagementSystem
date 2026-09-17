const db = require('../../config/db');

class BranchModel {
  /**
   * Create a new branch
   */
  static async createBranch(branchData) {
    const params = [
      branchData.school_id,
      branchData.branch_name,
      branchData.branch_code,
      branchData.address || null,
      branchData.contact_person || null,
      branchData.contact_number || null,
      branchData.branch_email || null,
      branchData.principal_name || null,
      branchData.is_main_branch || 0,
      branchData.short_branch_code || null,
      branchData.created_by || null
    ];
    return await db.callSP('sp_add_branch', params);
  }

  /**
   * Get all branches for a school
   */
  static async getBranches(schoolId) {
    return await db.callSP('sp_get_branches', [schoolId]);
  }

  /**
   * Get branch by ID
   */
  static async getBranchById(schoolId, branchId) {
    const [rows] = await db.pool.query(
      'SELECT id, school_id, branch_name, branch_code, address, contact_person, contact_number, branch_email, principal_name, is_main_branch, short_branch_code, status, created_at FROM tbl_school_branches WHERE id = ? AND school_id = ?',
      [branchId, schoolId]
    );
    return rows[0] || null;
  }

  /**
   * Update branch details
   */
  static async updateBranch(schoolId, branchId, branchData) {
    const query = `
      UPDATE tbl_school_branches 
      SET 
        branch_name = ?, 
        branch_code = ?, 
        address = ?, 
        contact_person = ?, 
        contact_number = ?, 
        branch_email = ?, 
        principal_name = ?, 
        is_main_branch = ?, 
        short_branch_code = ?,
        status = ?
      WHERE id = ? AND school_id = ?
    `;
    const params = [
      branchData.branch_name,
      branchData.branch_code,
      branchData.address || null,
      branchData.contact_person || null,
      branchData.contact_number || null,
      branchData.branch_email || null,
      branchData.principal_name || null,
      branchData.is_main_branch || 0,
      branchData.short_branch_code || null,
      branchData.status || 'Active',
      branchId,
      schoolId
    ];
    const [result] = await db.pool.query(query, params);
    return result;
  }

  /**
   * Toggle branch status between Active and Inactive
   */
  static async toggleBranchStatus(schoolId, branchId) {
    const [rows] = await db.pool.query(
      'SELECT status FROM tbl_school_branches WHERE id = ? AND school_id = ?',
      [branchId, schoolId]
    );
    if (rows.length === 0) throw new Error('Branch not found');

    const newStatus = rows[0].status === 'Active' ? 'Inactive' : 'Active';
    await db.pool.query(
      'UPDATE tbl_school_branches SET status = ? WHERE id = ? AND school_id = ?',
      [newStatus, branchId, schoolId]
    );
    return newStatus;
  }
}

module.exports = BranchModel;
