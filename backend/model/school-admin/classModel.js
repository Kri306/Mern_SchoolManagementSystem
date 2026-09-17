const db = require('../../config/db');

class ClassModel {
  /**
   * Fetch list of global master classes
   */
  static async getMasterClasses() {
    return await db.callSP('sp_get_classes');
  }

  /**
   * Add a new global class to master
   */
  static async createMasterClass(classData) {
    const params = [
      classData.class_name,
      classData.display_order || 0,
      classData.created_by
    ];
    return await db.callSP('sp_add_class', params);
  }

  /**
   * Fetch all classes assigned to a school and optionally a branch
   */
  static async getSchoolClasses(schoolId, branchId) {
    return await db.callSP('sp_get_school_classes', [schoolId, branchId]);
  }

  /**
   * Fetch details of a single school class mapping
   */
  static async getSchoolClassById(schoolId, schoolClassId) {
    const [rows] = await db.pool.query(
      `SELECT sc.*, c.class_name 
       FROM tbl_school_classes sc 
       JOIN tbl_classes c ON sc.class_id = c.class_id 
       WHERE sc.school_class_id = ? AND sc.school_id = ?`,
      [schoolClassId, schoolId]
    );
    return rows[0] || null;
  }

  /**
   * Assign a master class to a specific school branch
   */
  static async assignClassToBranch(schoolId, assignmentData) {
    const params = [
      assignmentData.class_id,
      schoolId,
      assignmentData.branch_id,
      assignmentData.location || null,
      assignmentData.student_capacity || 40,
      assignmentData.created_by
    ];
    return await db.callSP('sp_add_school_class', params);
  }

  /**
   * Update school class assignment details
   */
  static async updateSchoolClass(schoolId, schoolClassId, updateData) {
    const query = `
      UPDATE tbl_school_classes 
      SET 
        location = ?, 
        student_capacity = ?, 
        status = ?,
        branch_id = ?
      WHERE school_class_id = ? AND school_id = ?
    `;
    const params = [
      updateData.location || null,
      updateData.student_capacity || 40,
      updateData.status || 'Active',
      updateData.branch_id,
      schoolClassId,
      schoolId
    ];
    const [result] = await db.pool.query(query, params);
    return result;
  }

  /**
   * Toggle school class mapping status
   */
  static async toggleClassStatus(schoolId, schoolClassId) {
    const [rows] = await db.pool.query(
      'SELECT status FROM tbl_school_classes WHERE school_class_id = ? AND school_id = ?',
      [schoolClassId, schoolId]
    );
    if (rows.length === 0) throw new Error('Class assignment not found');

    const newStatus = rows[0].status === 'Active' ? 'Inactive' : 'Active';
    await db.pool.query(
      'UPDATE tbl_school_classes SET status = ? WHERE school_class_id = ? AND school_id = ?',
      [newStatus, schoolClassId, schoolId]
    );
    return newStatus;
  }
}

module.exports = ClassModel;
