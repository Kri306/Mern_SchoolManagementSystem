const db = require('../../config/db');
const bcrypt = require('bcryptjs');

class StudentModel {
  /**
   * List all students for a school
   */
  static async getStudents(schoolId) {
    return await db.callSP('sp_get_students', [schoolId]);
  }

  /**
   * Fetch student details by ID
   */
  static async getStudentById(schoolId, studentId) {
    const [rows] = await db.pool.query(
      `SELECT s.*, b.batch_code, sch.name as school_name, sb.branch_name
       FROM tbl_students s 
       LEFT JOIN tbl_batches b ON s.batch_id = b.batch_id
       LEFT JOIN tbl_schools sch ON s.school_id = sch.id
       LEFT JOIN tbl_school_branches sb ON s.school_id = sb.school_id AND sb.is_main_branch = 1
       WHERE s.student_id = ? AND s.school_id = ?`,
      [studentId, schoolId]
    );
    return rows[0] || null;
  }

  /**
   * Create a new student (hashes password and sets up authentication)
   */
  static async createStudent(schoolId, studentData) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(studentData.password || 'student123', salt);

    // Insert into tbl_users for Authentication
    const username = studentData.student_unique_id; // Unique user name
    const email = studentData.email || `${studentData.student_unique_id}@sms.com`;

    const [userResult] = await db.pool.query(
      'INSERT INTO tbl_users (username, email, password, role_id, status) VALUES (?, ?, ?, 4, "Active")',
      [username, email, hashedPassword]
    );

    const userId = userResult.insertId;

    const query = `
      INSERT INTO tbl_students (
        user_id, school_id, role_id, student_unique_id, admission_number, 
        gr_number, name, email, password, phone_number, admission_date, 
        roll_number, dob, gender, blood_group, address, pincode, 
        emergency_contact_number, documents, student_parent_details, 
        student_status, is_fee_exempted, gpa, status, created_by, batch_id, parent_ids
      ) VALUES (?, ?, 4, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active', ?, ?, 'Active', ?, ?, ?)
    `;

    const params = [
      userId,
      schoolId,
      studentData.student_unique_id,
      studentData.admission_number,
      studentData.gr_number || null,
      studentData.name,
      email,
      hashedPassword,
      studentData.phone_number || null,
      studentData.admission_date || null,
      studentData.roll_number || null,
      studentData.dob || null,
      studentData.gender || null,
      studentData.blood_group || null,
      studentData.address || null,
      studentData.pincode || null,
      studentData.emergency_contact_number || null,
      studentData.documents || null,
      studentData.student_parent_details || null,
      studentData.is_fee_exempted ? 1 : 0,
      studentData.gpa || 0.00,
      studentData.created_by || null,
      studentData.batch_id || null,
      studentData.parent_ids || null
    ];

    const [result] = await db.pool.query(query, params);
    return { student_id: result.insertId, user_id: userId };
  }

  /**
   * Update student details and sync with auth
   */
  static async updateStudent(schoolId, studentId, studentData) {
    const [current] = await db.pool.query('SELECT user_id, student_unique_id FROM tbl_students WHERE student_id = ? AND school_id = ?', [studentId, schoolId]);
    if (current.length === 0) throw new Error('Student not found');
    const userId = current[0].user_id;

    const query = `
      UPDATE tbl_students 
      SET 
        admission_number = ?, 
        gr_number = ?, 
        name = ?, 
        email = ?, 
        phone_number = ?, 
        admission_date = ?, 
        roll_number = ?, 
        dob = ?, 
        gender = ?, 
        blood_group = ?, 
        address = ?, 
        pincode = ?, 
        emergency_contact_number = ?, 
        documents = ?, 
        student_parent_details = ?, 
        is_fee_exempted = ?, 
        gpa = ?, 
        status = ?, 
        student_status = ?,
        batch_id = ?, 
        parent_ids = ?
      WHERE student_id = ? AND school_id = ?
    `;

    const params = [
      studentData.admission_number,
      studentData.gr_number || null,
      studentData.name,
      studentData.email || null,
      studentData.phone_number || null,
      studentData.admission_date || null,
      studentData.roll_number || null,
      studentData.dob || null,
      studentData.gender || null,
      studentData.blood_group || null,
      studentData.address || null,
      studentData.pincode || null,
      studentData.emergency_contact_number || null,
      studentData.documents || null,
      studentData.student_parent_details || null,
      studentData.is_fee_exempted ? 1 : 0,
      studentData.gpa || 0.00,
      studentData.status || 'Active',
      studentData.status || 'Active', // student_status maps to status
      studentData.batch_id || null,
      studentData.parent_ids || null,
      studentId,
      schoolId
    ];

    await db.pool.query(query, params);

    if (userId) {
      const email = studentData.email || `${current[0].student_unique_id}@sms.com`;
      await db.pool.query(
        'UPDATE tbl_users SET email = ?, status = ? WHERE id = ?',
        [email, studentData.status || 'Active', userId]
      );

      if (studentData.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(studentData.password, salt);
        await db.pool.query('UPDATE tbl_users SET password = ? WHERE id = ?', [hashedPassword, userId]);
        await db.pool.query('UPDATE tbl_students SET password = ? WHERE student_id = ?', [hashedPassword, studentId]);
      }
    }
  }

  /**
   * Toggle student active status
   */
  static async toggleStudentStatus(schoolId, studentId) {
    const [rows] = await db.pool.query('SELECT status, user_id FROM tbl_students WHERE student_id = ? AND school_id = ?', [studentId, schoolId]);
    if (rows.length === 0) throw new Error('Student not found');

    const newStatus = rows[0].status === 'Active' ? 'Inactive' : 'Active';
    await db.pool.query(
      'UPDATE tbl_students SET status = ?, student_status = ? WHERE student_id = ? AND school_id = ?',
      [newStatus, newStatus, studentId, schoolId]
    );

    if (rows[0].user_id) {
      await db.pool.query('UPDATE tbl_users SET status = ? WHERE id = ?', [newStatus, rows[0].user_id]);
    }
    return newStatus;
  }
}

module.exports = StudentModel;
