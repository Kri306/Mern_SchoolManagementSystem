const db = require('../../config/db');
const bcrypt = require('bcryptjs');

class ProfileModel {
  /**
   * Fetch school admin details
   */
  static async getProfile(adminId, schoolId) {
    const query = `
      SELECT sa.id, sa.user_id, sa.school_id, sa.name, sa.email, sa.phone_number, 
             sa.status, sa.registration_status, sa.profile_pic, sa.created_at, 
             r.role_name, s.name as school_name
      FROM tbl_school_admin sa 
      JOIN tbl_roles r ON sa.role_id = r.role_id 
      LEFT JOIN tbl_schools s ON sa.school_id = s.id
      WHERE sa.id = ? AND sa.school_id = ?
    `;
    const [rows] = await db.pool.query(query, [adminId, schoolId]);
    return rows[0] || null;
  }

  /**
   * Update profile info
   */
  static async updateProfile(adminId, schoolId, userId, profileData) {
    // 1. Update tbl_school_admin
    const queryAdmin = `
      UPDATE tbl_school_admin 
      SET 
        name = ?, 
        email = ?, 
        phone_number = ?, 
        profile_pic = ?
      WHERE id = ? AND school_id = ?
    `;
    await db.pool.query(queryAdmin, [
      profileData.name,
      profileData.email,
      profileData.phone_number || null,
      profileData.profile_pic || null,
      adminId,
      schoolId
    ]);

    // 2. Sync with tbl_users
    if (userId) {
      await db.pool.query(
        'UPDATE tbl_users SET username = ?, email = ? WHERE id = ?',
        [profileData.email, profileData.email, userId]
      );
    }
  }

  /**
   * Verify old password and set a new password
   */
  static async changePassword(userId, oldPassword, newPassword) {
    // 1. Fetch current password
    const [rows] = await db.pool.query('SELECT password FROM tbl_users WHERE id = ?', [userId]);
    if (rows.length === 0) throw new Error('User account not found');

    const currentHashedPassword = rows[0].password;

    // 2. Verify
    const isMatch = await bcrypt.compare(oldPassword, currentHashedPassword);
    if (!isMatch) throw new Error('Incorrect old password');

    // 3. Hash and update
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    await db.pool.query('UPDATE tbl_users SET password = ? WHERE id = ?', [newHashedPassword, userId]);
    await db.pool.query('UPDATE tbl_school_admin SET password = ? WHERE user_id = ?', [newHashedPassword, userId]);
  }
}

module.exports = ProfileModel;
