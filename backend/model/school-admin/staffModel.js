const db = require('../../config/db');
const bcrypt = require('bcryptjs');

class StaffModel {
  /**
   * Create new staff
   */
  static async createStaff(staffData) {
    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(staffData.password || 'admin123', salt);

    const params = [
      staffData.name,
      staffData.email,
      staffData.phone_number || null,
      staffData.school_id,
      staffData.branch_id,
      staffData.staff_type_id || null,
      staffData.custom_staff_type || null,
      staffData.department_id || null,
      staffData.custom_staff_department || null,
      hashedPassword,
      staffData.created_by || null
    ];
    return await db.callSP('sp_add_staff', params);
  }

  /**
   * Fetch all staff for a school
   */
  static async getStaff(schoolId) {
    return await db.callSP('sp_get_staff', [schoolId]);
  }

  /**
   * Fetch staff member by ID
   */
  static async getStaffById(schoolId, staffId) {
    const [rows] = await db.pool.query(
      `SELECT s.*, st.type_name as staff_type, sd.department_name, b.branch_name, r.role_name
       FROM tbl_staff s 
       LEFT JOIN tbl_staff_types st ON s.staff_type_id = st.id 
       LEFT JOIN tbl_staff_departments sd ON s.department_id = sd.id 
       LEFT JOIN tbl_school_branches b ON s.branch_id = b.id
       LEFT JOIN tbl_roles r ON s.role_id = r.role_id
       WHERE s.id = ? AND s.school_id = ?`,
      [staffId, schoolId]
    );
    return rows[0] || null;
  }

  /**
   * Update staff details and sync with user authentication table
   */
  static async updateStaff(schoolId, staffId, staffData) {
    const [current] = await db.pool.query('SELECT user_id FROM tbl_staff WHERE id = ? AND school_id = ?', [staffId, schoolId]);
    if (current.length === 0) throw new Error('Staff member not found');
    const userId = current[0].user_id;

    const staffQuery = `
      UPDATE tbl_staff 
      SET 
        name = ?, 
        email = ?, 
        phone_number = ?, 
        branch_id = ?, 
        staff_type_id = ?, 
        custom_staff_type = ?, 
        department_id = ?, 
        custom_staff_department = ?, 
        office_location = ?, 
        qualification = ?, 
        joining_date = ?, 
        experience = ?, 
        salary = ?, 
        performance_record = ?, 
        status = ?, 
        role_id = ?
      WHERE id = ? AND school_id = ?
    `;
    const staffParams = [
      staffData.name,
      staffData.email,
      staffData.phone_number || null,
      staffData.branch_id || null,
      staffData.staff_type_id || null,
      staffData.custom_staff_type || null,
      staffData.department_id || null,
      staffData.custom_staff_department || null,
      staffData.office_location || null,
      staffData.qualification || null,
      staffData.joining_date || null,
      staffData.experience || null,
      staffData.salary || null,
      staffData.performance_record || null,
      staffData.status || 'Active',
      staffData.role_id || 3,
      staffId,
      schoolId
    ];
    await db.pool.query(staffQuery, staffParams);

    if (userId) {
      await db.pool.query(
        'UPDATE tbl_users SET username = ?, email = ?, role_id = ? WHERE id = ?',
        [staffData.email, staffData.email, staffData.role_id || 3, userId]
      );

      if (staffData.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(staffData.password, salt);
        await db.pool.query('UPDATE tbl_users SET password = ? WHERE id = ?', [hashedPassword, userId]);
        await db.pool.query('UPDATE tbl_staff SET password = ? WHERE id = ?', [hashedPassword, staffId]);
      }
    }
  }

  /**
   * Toggle staff active status
   */
  static async toggleStaffStatus(schoolId, staffId) {
    const [rows] = await db.pool.query('SELECT status, user_id FROM tbl_staff WHERE id = ? AND school_id = ?', [staffId, schoolId]);
    if (rows.length === 0) throw new Error('Staff member not found');

    const newStatus = rows[0].status === 'Active' ? 'Inactive' : 'Active';
    await db.pool.query('UPDATE tbl_staff SET status = ? WHERE id = ? AND school_id = ?', [newStatus, staffId, schoolId]);
    
    if (rows[0].user_id) {
      await db.pool.query('UPDATE tbl_users SET status = ? WHERE id = ?', [newStatus, rows[0].user_id]);
    }
    return newStatus;
  }

  /**
   * Fetch active staff types
   */
  static async getStaffTypes() {
    return await db.callSP('sp_get_staff_types');
  }

  /**
   * Fetch active staff departments
   */
  static async getStaffDepartments() {
    return await db.callSP('sp_get_staff_departments');
  }
}

module.exports = StaffModel;
