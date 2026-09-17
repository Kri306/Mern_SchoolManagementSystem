const db = require('../../config/db');

class BoardModel {
  /**
   * Fetch school boards
   */
  static async getSchoolBoards(schoolId) {
    const query = `
      SELECT sb.*, mb.board_name, mb.board_logo, mb.description 
      FROM tbl_school_boards sb 
      JOIN tbl_master_school_boards mb ON sb.master_board_id = mb.master_board_id 
      WHERE sb.school_id = ?
      ORDER BY sb.school_board_id DESC
    `;
    const [rows] = await db.pool.query(query, [schoolId]);
    return rows;
  }

  /**
   * Fetch master boards that can be linked
   */
  static async getMasterBoards(schoolId) {
    const query = `
      SELECT * FROM tbl_master_school_boards 
      WHERE status = 'Active' 
        AND (requested_by IS NULL OR requested_by = ? OR approval_status = 'Approved')
      ORDER BY master_board_id DESC
    `;
    const [rows] = await db.pool.query(query, [schoolId]);
    return rows;
  }

  /**
   * Request association with an existing master board
   */
  static async requestExistingBoard(schoolId, masterBoardId, customName = null, customLogo = null, customDesc = null) {
    // Check if already linked
    const [check] = await db.pool.query(
      'SELECT school_board_id FROM tbl_school_boards WHERE school_id = ? AND master_board_id = ?',
      [schoolId, masterBoardId]
    );
    if (check.length > 0) throw new Error('Board association already exists or is pending');

    const query = `
      INSERT INTO tbl_school_boards (
        school_id, master_board_id, custom_board_name, custom_board_logo, custom_description, request_status, status
      ) VALUES (?, ?, ?, ?, ?, 'Pending', 'Active')
    `;
    const [result] = await db.pool.query(query, [
      schoolId,
      masterBoardId,
      customName,
      customLogo,
      customDesc
    ]);
    return { school_board_id: result.insertId };
  }

  /**
   * Request a new custom board (creates global master board record in Pending status and associates it)
   */
  static async requestCustomBoard(schoolId, name, description, logo = null) {
    // 1. Insert into tbl_master_school_boards
    const [masterResult] = await db.pool.query(
      `INSERT INTO tbl_master_school_boards (board_name, board_logo, description, requested_by, approval_status, status)
       VALUES (?, ?, ?, ?, 'Pending', 'Active')`,
      [name, logo, description || null, schoolId]
    );
    
    const masterBoardId = masterResult.insertId;

    // 2. Associate in tbl_school_boards
    const [assocResult] = await db.pool.query(
      `INSERT INTO tbl_school_boards (
        school_id, master_board_id, custom_board_name, custom_board_logo, custom_description, request_status, status
       ) VALUES (?, ?, ?, ?, ?, 'Pending', 'Active')`,
      [schoolId, masterBoardId, name, logo, description]
    );

    return {
      master_board_id: masterBoardId,
      school_board_id: assocResult.insertId
    };
  }

  /**
   * Toggle school board status
   */
  static async toggleBoardStatus(schoolId, schoolBoardId) {
    const [rows] = await db.pool.query(
      'SELECT status FROM tbl_school_boards WHERE school_board_id = ? AND school_id = ?',
      [schoolBoardId, schoolId]
    );
    if (rows.length === 0) throw new Error('School board association not found');

    const newStatus = rows[0].status === 'Active' ? 'Inactive' : 'Active';
    await db.pool.query(
      'UPDATE tbl_school_boards SET status = ? WHERE school_board_id = ? AND school_id = ?',
      [newStatus, schoolBoardId, schoolId]
    );
    return newStatus;
  }
}

module.exports = BoardModel;
