const db = require('../../config/db');

class BatchModel {
  /**
   * Fetch all batches belonging to a school
   */
  static async getBatches(schoolId) {
    const query = `
      SELECT b.*, c.class_name, sec.section_name, y.academic_year_name, t.name as teacher_name
      FROM tbl_batches b 
      JOIN tbl_school_classes sc ON b.school_class_id = sc.school_class_id 
      JOIN tbl_classes c ON sc.class_id = c.class_id 
      JOIN tbl_sections sec ON b.section_id = sec.section_id 
      JOIN tbl_academic_years y ON b.academic_year_id = y.academic_year_id 
      LEFT JOIN tbl_staff t ON b.teacher_id = t.id 
      WHERE sc.school_id = ?
      ORDER BY b.batch_id DESC
    `;
    const [rows] = await db.pool.query(query, [schoolId]);
    return rows;
  }

  /**
   * Fetch details of a single batch
   */
  static async getBatchById(schoolId, batchId) {
    const query = `
      SELECT b.*, c.class_name, sec.section_name, y.academic_year_name, t.name as teacher_name
      FROM tbl_batches b 
      JOIN tbl_school_classes sc ON b.school_class_id = sc.school_class_id 
      JOIN tbl_classes c ON sc.class_id = c.class_id 
      JOIN tbl_sections sec ON b.section_id = sec.section_id 
      JOIN tbl_academic_years y ON b.academic_year_id = y.academic_year_id 
      LEFT JOIN tbl_staff t ON b.teacher_id = t.id 
      WHERE b.batch_id = ? AND sc.school_id = ?
    `;
    const [rows] = await db.pool.query(query, [batchId, schoolId]);
    return rows[0] || null;
  }

  /**
   * Create a new batch using sp_add_batch
   */
  static async createBatch(schoolId, batchData) {
    const params = [
      batchData.batch_code,
      batchData.school_class_id,
      batchData.academic_year_id,
      batchData.section_id,
      batchData.teacher_id || null,
      batchData.created_by
    ];
    
    // Call standard SP
    const result = await db.callSP('sp_add_batch', params);
    
    // Update additional fields (medium, times, duration) if provided
    const batchId = result.batch_id || result.insertId || (Array.isArray(result) && result[0]?.batch_id);
    if (batchId && (batchData.school_medium_id || batchData.start_time || batchData.end_time || batchData.duration_minutes)) {
      await db.pool.query(
        `UPDATE tbl_batches 
         SET 
           school_medium_id = ?, 
           start_time = ?, 
           end_time = ?, 
           duration_minutes = ?
         WHERE batch_id = ?`,
        [
          batchData.school_medium_id || null,
          batchData.start_time || null,
          batchData.end_time || null,
          batchData.duration_minutes || 0,
          batchId
        ]
      );
    }
    return result;
  }

  /**
   * Update batch details
   */
  static async updateBatch(schoolId, batchId, batchData) {
    // Verify batch belongs to school first
    const checkQuery = `
      SELECT b.batch_id 
      FROM tbl_batches b 
      JOIN tbl_school_classes sc ON b.school_class_id = sc.school_class_id 
      WHERE b.batch_id = ? AND sc.school_id = ?
    `;
    const [check] = await db.pool.query(checkQuery, [batchId, schoolId]);
    if (check.length === 0) throw new Error('Batch not found');

    const query = `
      UPDATE tbl_batches 
      SET 
        batch_code = ?, 
        school_class_id = ?, 
        academic_year_id = ?, 
        section_id = ?, 
        teacher_id = ?, 
        school_medium_id = ?, 
        start_time = ?, 
        end_time = ?, 
        duration_minutes = ?,
        status = ?
      WHERE batch_id = ?
    `;
    const params = [
      batchData.batch_code,
      batchData.school_class_id,
      batchData.academic_year_id,
      batchData.section_id,
      batchData.teacher_id || null,
      batchData.school_medium_id || null,
      batchData.start_time || null,
      batchData.end_time || null,
      batchData.duration_minutes || 0,
      batchData.status || 'Active',
      batchId
    ];
    const [result] = await db.pool.query(query, params);
    return result;
  }

  /**
   * Assign a teacher to a batch
   */
  static async assignTeacher(schoolId, batchId, teacherId) {
    // Verify batch belongs to school first
    const checkQuery = `
      SELECT b.batch_id 
      FROM tbl_batches b 
      JOIN tbl_school_classes sc ON b.school_class_id = sc.school_class_id 
      WHERE b.batch_id = ? AND sc.school_id = ?
    `;
    const [check] = await db.pool.query(checkQuery, [batchId, schoolId]);
    if (check.length === 0) throw new Error('Batch not found');

    const [result] = await db.pool.query(
      'UPDATE tbl_batches SET teacher_id = ? WHERE batch_id = ?',
      [teacherId || null, batchId]
    );
    return result;
  }

  /**
   * Toggle batch status between Active and Inactive
   */
  static async toggleBatchStatus(schoolId, batchId) {
    const checkQuery = `
      SELECT b.batch_id, b.status
      FROM tbl_batches b 
      JOIN tbl_school_classes sc ON b.school_class_id = sc.school_class_id 
      WHERE b.batch_id = ? AND sc.school_id = ?
    `;
    const [rows] = await db.pool.query(checkQuery, [batchId, schoolId]);
    if (rows.length === 0) throw new Error('Batch not found');

    const newStatus = rows[0].status === 'Active' ? 'Inactive' : 'Active';
    await db.pool.query(
      'UPDATE tbl_batches SET status = ? WHERE batch_id = ?',
      [newStatus, batchId]
    );
    return newStatus;
  }
}

module.exports = BatchModel;
