const db = require('../../config/db');
const bcrypt = require('bcryptjs');

class ParentModel {
  /**
   * Fetch all parents for a school
   */
  static async getParents(schoolId) {
    const [rows] = await db.pool.query(
      'SELECT * FROM tbl_parent WHERE school_id = ? ORDER BY parent_id DESC',
      [schoolId]
    );
    return rows;
  }

  /**
   * Fetch parent details by ID
   */
  static async getParentById(schoolId, parentId) {
    const [rows] = await db.pool.query(
      'SELECT * FROM tbl_parent WHERE parent_id = ? AND school_id = ?',
      [parentId, schoolId]
    );
    return rows[0] || null;
  }

  /**
   * Create a parent (hashes password and sets up auth account)
   */
  static async createParent(schoolId, parentData) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(parentData.password || 'parent123', salt);

    const email = parentData.email || `${parentData.phone}@parent.sms.com`;

    // 1. Create auth user in tbl_users
    const [userResult] = await db.pool.query(
      'INSERT INTO tbl_users (username, email, password, role_id, status) VALUES (?, ?, ?, 5, "Active")',
      [parentData.phone, email, hashedPassword]
    );

    const userId = userResult.insertId;

    // 2. Insert into tbl_parent
    const query = `
      INSERT INTO tbl_parent (
        user_id, role_id, school_id, branch_id, name, email, phone, password, parent_details, status, telegram_chat_id, created_by
      ) VALUES (?, 5, ?, ?, ?, ?, ?, ?, ?, 'Active', ?, ?)
    `;
    const params = [
      userId,
      schoolId,
      parentData.branch_id || 1,
      parentData.name,
      email,
      parentData.phone,
      hashedPassword,
      parentData.parent_details || null,
      parentData.telegram_chat_id || null,
      parentData.created_by || null
    ];

    const [result] = await db.pool.query(query, params);
    return { parent_id: result.insertId, user_id: userId };
  }

  /**
   * Update parent details and sync with auth
   */
  static async updateParent(schoolId, parentId, parentData) {
    const [current] = await db.pool.query(
      'SELECT user_id, phone FROM tbl_parent WHERE parent_id = ? AND school_id = ?',
      [parentId, schoolId]
    );
    if (current.length === 0) throw new Error('Parent not found');
    const userId = current[0].user_id;

    const query = `
      UPDATE tbl_parent 
      SET 
        name = ?, 
        email = ?, 
        phone = ?, 
        branch_id = ?, 
        parent_details = ?, 
        status = ?, 
        telegram_chat_id = ?
      WHERE parent_id = ? AND school_id = ?
    `;
    const email = parentData.email || `${parentData.phone}@parent.sms.com`;
    const params = [
      parentData.name,
      email,
      parentData.phone,
      parentData.branch_id || 1,
      parentData.parent_details || null,
      parentData.status || 'Active',
      parentData.telegram_chat_id || null,
      parentId,
      schoolId
    ];

    await db.pool.query(query, params);

    if (userId) {
      await db.pool.query(
        'UPDATE tbl_users SET username = ?, email = ?, status = ? WHERE id = ?',
        [parentData.phone, email, parentData.status || 'Active', userId]
      );

      if (parentData.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(parentData.password, salt);
        await db.pool.query('UPDATE tbl_users SET password = ? WHERE id = ?', [hashedPassword, userId]);
        await db.pool.query('UPDATE tbl_parent SET password = ? WHERE parent_id = ?', [hashedPassword, parentId]);
      }
    }
  }

  /**
   * Toggle parent active status
   */
  static async toggleParentStatus(schoolId, parentId) {
    const [rows] = await db.pool.query('SELECT status, user_id FROM tbl_parent WHERE parent_id = ? AND school_id = ?', [parentId, schoolId]);
    if (rows.length === 0) throw new Error('Parent not found');

    const newStatus = rows[0].status === 'Active' ? 'Inactive' : 'Active';
    await db.pool.query(
      'UPDATE tbl_parent SET status = ? WHERE parent_id = ? AND school_id = ?',
      [newStatus, parentId, schoolId]
    );

    if (rows[0].user_id) {
      await db.pool.query('UPDATE tbl_users SET status = ? WHERE id = ?', [newStatus, rows[0].user_id]);
    }
    return newStatus;
  }
}

module.exports = ParentModel;
