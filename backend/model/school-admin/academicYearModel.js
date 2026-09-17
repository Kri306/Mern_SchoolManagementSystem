const db = require('../../config/db');

class AcademicYearModel {
  /**
   * Fetch all academic years for a school
   */
  static async getAcademicYears(schoolId) {
    return await db.callSP('sp_get_academic_years', [schoolId]);
  }

  /**
   * Fetch a single academic year by ID
   */
  static async getAcademicYearById(schoolId, yearId) {
    const [rows] = await db.pool.query(
      'SELECT * FROM tbl_academic_years WHERE academic_year_id = ? AND school_id = ?',
      [yearId, schoolId]
    );
    return rows[0] || null;
  }

  /**
   * Add academic year using stored procedure
   */
  static async createAcademicYear(yearData) {
    const params = [
      yearData.school_id,
      yearData.branch_id || 1, // Default or selected branch
      yearData.academic_year_name,
      yearData.semester || null,
      yearData.start_date || null,
      yearData.end_date || null,
      yearData.created_by
    ];
    return await db.callSP('sp_add_academic_year', params);
  }

  /**
   * Update academic year details
   */
  static async updateAcademicYear(schoolId, yearId, yearData) {
    const query = `
      UPDATE tbl_academic_years 
      SET 
        academic_year_name = ?, 
        semester = ?, 
        start_date = ?, 
        end_date = ?, 
        status = ?,
        branch_id = ?
      WHERE academic_year_id = ? AND school_id = ?
    `;
    const params = [
      yearData.academic_year_name,
      yearData.semester || null,
      yearData.start_date || null,
      yearData.end_date || null,
      yearData.status || 'Active',
      yearData.branch_id || 1,
      yearId,
      schoolId
    ];
    const [result] = await db.pool.query(query, params);
    return result;
  }

  /**
   * Set academic year as current and set others to non-current
   */
  static async setCurrentYear(schoolId, yearId) {
    // 1. Set all to 0
    await db.pool.query(
      'UPDATE tbl_academic_years SET is_current = 0 WHERE school_id = ?',
      [schoolId]
    );
    // 2. Set chosen to 1
    const [result] = await db.pool.query(
      'UPDATE tbl_academic_years SET is_current = 1, status = "Active" WHERE academic_year_id = ? AND school_id = ?',
      [yearId, schoolId]
    );
    return result;
  }

  // --- SESSIONS IN ACADEMIC YEARS ---

  /**
   * Fetch all sessions for a specific academic year
   */
  static async getSessionsByYear(yearId) {
    const [rows] = await db.pool.query(
      'SELECT * FROM tbl_academic_year_sessions WHERE academic_year_id = ? ORDER BY session_id DESC',
      [yearId]
    );
    return rows;
  }

  /**
   * Add a session to an academic year
   */
  static async createSession(sessionData) {
    const query = `
      INSERT INTO tbl_academic_year_sessions (
        academic_year_id, session_name, session_number, start_date, end_date, created_by
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
      sessionData.academic_year_id,
      sessionData.session_name,
      sessionData.session_number || null,
      sessionData.start_date || null,
      sessionData.end_date || null,
      sessionData.created_by
    ];
    const [result] = await db.pool.query(query, params);
    return { session_id: result.insertId };
  }

  /**
   * Update academic session details
   */
  static async updateSession(yearId, sessionId, sessionData) {
    const query = `
      UPDATE tbl_academic_year_sessions 
      SET 
        session_name = ?, 
        session_number = ?, 
        start_date = ?, 
        end_date = ?, 
        status = ?
      WHERE session_id = ? AND academic_year_id = ?
    `;
    const params = [
      sessionData.session_name,
      sessionData.session_number || null,
      sessionData.start_date || null,
      sessionData.end_date || null,
      sessionData.status || 'Active',
      sessionId,
      yearId
    ];
    const [result] = await db.pool.query(query, params);
    return result;
  }

  /**
   * Set academic session as current term inside an academic year
   */
  static async setCurrentSession(yearId, sessionId) {
    await db.pool.query(
      'UPDATE tbl_academic_year_sessions SET is_current = 0 WHERE academic_year_id = ?',
      [yearId]
    );
    const [result] = await db.pool.query(
      'UPDATE tbl_academic_year_sessions SET is_current = 1 WHERE session_id = ? AND academic_year_id = ?',
      [sessionId, yearId]
    );
    return result;
  }
}

module.exports = AcademicYearModel;
