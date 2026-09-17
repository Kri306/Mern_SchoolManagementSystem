const { pool, callSP } = require('../../config/db');
const bcrypt = require('bcryptjs');

class ProfileModel {
  /**
   * Get student profile by ID
   */
  static async getStudentProfile(studentId) {
    return await callSP('sp_get_student_profile', [studentId]);
  }

  /**
   * Change password for student/parent account
   */
  static async changePassword(userId, profileId, roleId, newPasswordPlain) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPasswordPlain, salt);

    // 1. Update password in tbl_users
    await pool.query(
      'UPDATE tbl_users SET password = ? WHERE id = ?',
      [hashedPassword, userId]
    );

    // 2. Update password in tbl_students or tbl_parent
    if (roleId === 4) {
      await pool.query(
        'UPDATE tbl_students SET password = ? WHERE student_id = ?',
        [hashedPassword, profileId]
      );
    } else if (roleId === 5) {
      await pool.query(
        'UPDATE tbl_parent SET password = ? WHERE parent_id = ?',
        [hashedPassword, profileId]
      );
    }

    return true;
  }
}

module.exports = ProfileModel;
