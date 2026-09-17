const db = require('../../config/db');

class RequestModel {
  /**
   * Fetch all medium and board requests submitted by this school
   * @param {number} schoolId 
   * @param {string} statusFilter - Optional status filter: 'Pending', 'Approved', 'Rejected'
   * @returns {Promise<Array>}
   */
  static async getRequests(schoolId, statusFilter = null) {
    let mediumQuery = `
      SELECT 'Medium' as request_type, sm.school_medium_id as id, mm.medium_name as item_name, 
             sm.approval_status as status, sm.created_at 
      FROM tbl_school_mediums sm 
      JOIN tbl_master_mediums mm ON sm.master_medium_id = mm.master_medium_id 
      WHERE sm.school_id = ?
    `;

    let boardQuery = `
      SELECT 'Board' as request_type, sb.school_board_id as id, mb.board_name as item_name, 
             sb.request_status as status, sb.created_at 
      FROM tbl_school_boards sb 
      JOIN tbl_master_school_boards mb ON sb.master_board_id = mb.master_board_id 
      WHERE sb.school_id = ?
    `;

    const params = [schoolId, schoolId];

    // Combine using UNION
    let unionQuery = `
      SELECT * FROM (
        (${mediumQuery})
        UNION ALL
        (${boardQuery})
      ) AS requests
    `;

    if (statusFilter) {
      unionQuery += ` WHERE requests.status = ?`;
      params.push(statusFilter);
    }

    unionQuery += ` ORDER BY requests.created_at DESC`;

    const [rows] = await db.pool.query(unionQuery, params);
    return rows;
  }
}

module.exports = RequestModel;
