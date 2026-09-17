const db = require('../../config/db');

class PermissionModel {
  /**
   * Fetch role module permissions matrix (excluding Super Admin role)
   */
  static async getPermissionsMatrix() {
    const query = `
      SELECT p.*, r.role_name, m.module_name 
      FROM tbl_role_module_permissions p 
      JOIN tbl_roles r ON p.role_id = r.role_id 
      JOIN tbl_modules m ON p.module_id = m.id 
      WHERE r.role_id != 1
      ORDER BY r.role_id ASC, m.id ASC
    `;
    const [rows] = await db.pool.query(query);
    return rows;
  }

  /**
   * Update a specific permission node
   */
  static async updatePermissionNode(nodeId, data, updatedBy) {
    const query = `
      UPDATE tbl_role_module_permissions 
      SET 
        can_read = ?, 
        can_write = ?, 
        can_update = ?, 
        can_delete = ?, 
        can_more = ?, 
        updated_by = ?
      WHERE id = ?
    `;
    const params = [
      data.can_read ? 1 : 0,
      data.can_write ? 1 : 0,
      data.can_update ? 1 : 0,
      data.can_delete ? 1 : 0,
      data.can_more ? 1 : 0,
      updatedBy,
      nodeId
    ];
    const [result] = await db.pool.query(query, params);
    return result;
  }
}

module.exports = PermissionModel;
