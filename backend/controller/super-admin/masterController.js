const db = require('../../config/db');
const bcrypt = require('bcryptjs');

class MasterController {
  // 1. Dashboard counts
  static async getDashboardCounts(req, res) {
    try {
      const [schools] = await db.pool.query('SELECT COUNT(*) as count FROM tbl_schools');
      const [branches] = await db.pool.query('SELECT COUNT(*) as count FROM tbl_school_branches');
      const [admins] = await db.pool.query('SELECT COUNT(*) as count FROM tbl_school_admin');
      const [staff] = await db.pool.query('SELECT COUNT(*) as count FROM tbl_staff');
      const [students] = await db.pool.query('SELECT COUNT(*) as count FROM tbl_students');
      const [parents] = await db.pool.query('SELECT COUNT(*) as count FROM tbl_parent');

      res.status(200).json({
        success: true,
        counts: {
          schools: schools[0].count,
          branches: branches[0].count,
          admins: admins[0].count,
          staff: staff[0].count,
          students: students[0].count,
          parents: parents[0].count
        }
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // 2. Branches
  static async getBranches(req, res) {
    try {
      const [rows] = await db.pool.query(
        'SELECT b.*, s.name as school_name FROM tbl_school_branches b LEFT JOIN tbl_schools s ON b.school_id = s.id ORDER BY b.id DESC'
      );
      res.status(200).json({ success: true, data: rows });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async createBranch(req, res) {
    try {
      const { school_id, branch_name, branch_code, address, contact_person, contact_number, branch_email, principal_name, is_main_branch, short_branch_code } = req.body;
      const created_by = req.user?.id || null;

      const [result] = await db.pool.query(
        'INSERT INTO tbl_school_branches (school_id, branch_name, branch_code, address, contact_person, contact_number, branch_email, principal_name, is_main_branch, short_branch_code, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [school_id, branch_name, branch_code, address || null, contact_person || null, contact_number || null, branch_email || null, principal_name || null, is_main_branch ? 1 : 0, short_branch_code || null, created_by]
      );

      res.status(201).json({ success: true, message: 'Branch registered successfully', data: { id: result.insertId } });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async toggleBranchStatus(req, res) {
    try {
      const branchId = parseInt(req.params.id, 10);
      const [rows] = await db.pool.query('SELECT status FROM tbl_school_branches WHERE id = ?', [branchId]);
      if (rows.length === 0) return res.status(404).json({ success: false, message: 'Branch not found' });

      const newStatus = rows[0].status === 'Active' ? 'Inactive' : 'Active';
      await db.pool.query('UPDATE tbl_school_branches SET status = ? WHERE id = ?', [newStatus, branchId]);

      res.status(200).json({ success: true, message: `Status updated to ${newStatus}` });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // 3. School Boards
  static async getSchoolBoards(req, res) {
    try {
      const [rows] = await db.pool.query(
        'SELECT mb.*, s.name as requested_school_name FROM tbl_master_school_boards mb LEFT JOIN tbl_schools s ON mb.requested_by = s.id ORDER BY mb.master_board_id DESC'
      );
      res.status(200).json({ success: true, data: rows });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async createSchoolBoard(req, res) {
    try {
      const { board_name, code, description } = req.body;
      const created_by = req.user?.id || null;

      const [result] = await db.pool.query(
        'INSERT INTO tbl_master_school_boards (board_name, board_logo, description, approval_status, created_by) VALUES (?, ?, ?, ?, ?)',
        [board_name, code || null, description || null, 'Pending', created_by]
      );

      res.status(201).json({ success: true, data: { master_board_id: result.insertId } });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async approveSchoolBoard(req, res) {
    try {
      const boardId = parseInt(req.params.id, 10);
      const { status } = req.body;
      const updated_by = req.user?.id || null;

      await db.pool.query(
        'UPDATE tbl_master_school_boards SET approval_status = ?, updated_by = ? WHERE master_board_id = ?',
        [status, updated_by, boardId]
      );

      res.status(200).json({ success: true, message: 'Board request updated successfully' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // 4. School Mediums
  static async getSchoolMediums(req, res) {
    try {
      const [rows] = await db.pool.query(
        'SELECT mm.*, s.name as requested_school_name FROM tbl_master_mediums mm LEFT JOIN tbl_schools s ON mm.requested_by_school_id = s.id ORDER BY mm.master_medium_id DESC'
      );
      res.status(200).json({ success: true, data: rows });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async createSchoolMedium(req, res) {
    try {
      const { name, code } = req.body;
      const created_by = req.user?.id || null;

      const [result] = await db.pool.query(
        'INSERT INTO tbl_master_mediums (medium_name, description, approval_status, created_by) VALUES (?, ?, ?, ?)',
        [name, code || null, 'Pending', created_by]
      );

      res.status(201).json({ success: true, data: { master_medium_id: result.insertId } });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async approveSchoolMedium(req, res) {
    try {
      const mediumId = parseInt(req.params.id, 10);
      const { status } = req.body;
      const approved_by = req.user?.id || null;

      await db.pool.query(
        'UPDATE tbl_master_mediums SET approval_status = ?, approved_by = ?, approved_at = NOW() WHERE master_medium_id = ?',
        [status, approved_by, mediumId]
      );

      res.status(200).json({ success: true, message: 'Medium request updated successfully' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // 5. Staff
  static async getStaff(req, res) {
    try {
      const [rows] = await db.pool.query(
        'SELECT s.*, sch.name as school_name, b.branch_name, st.type_name as staff_type, sd.department_name FROM tbl_staff s LEFT JOIN tbl_schools sch ON s.school_id = sch.id LEFT JOIN tbl_school_branches b ON s.branch_id = b.id LEFT JOIN tbl_staff_types st ON s.staff_type_id = st.id LEFT JOIN tbl_staff_departments sd ON s.department_id = sd.id ORDER BY s.id DESC'
      );
      res.status(200).json({ success: true, data: rows });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async createStaff(req, res) {
    try {
      const { name, email, phone_number, school_id, branch_id, staff_type_id, department_id, qualification, experience, salary, password } = req.body;
      const super_created_by = req.user?.id || null;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password || 'admin123', salt);

      // Create authentication user record in tbl_users first
      const [userResult] = await db.pool.query(
        'INSERT INTO tbl_users (username, email, password, role_id, status) VALUES (?, ?, ?, 3, "Active")',
        [email, email, hashedPassword]
      );

      const [result] = await db.pool.query(
        'INSERT INTO tbl_staff (user_id, name, email, phone_number, school_id, branch_id, staff_type_id, department_id, qualification, experience, salary, role_id, registration_status, password, super_created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 3, "Approved", ?, ?)',
        [userResult.insertId, name, email, phone_number || null, school_id || null, branch_id || null, staff_type_id || null, department_id || null, qualification || null, experience || null, salary || null, hashedPassword, super_created_by]
      );

      res.status(201).json({ success: true, message: 'Staff registered successfully', data: { id: result.insertId } });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async approveStaff(req, res) {
    try {
      const staffId = parseInt(req.params.id, 10);
      await db.pool.query(
        'UPDATE tbl_staff SET registration_status = "Approved", super_updated_by = ? WHERE id = ?',
        [req.user?.id || null, staffId]
      );
      res.status(200).json({ success: true, message: 'Staff registration approved successfully' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async toggleStaffStatus(req, res) {
    try {
      const staffId = parseInt(req.params.id, 10);
      const [rows] = await db.pool.query('SELECT status FROM tbl_staff WHERE id = ?', [staffId]);
      if (rows.length === 0) return res.status(404).json({ success: false, message: 'Staff member not found' });

      const newStatus = rows[0].status === 'Active' ? 'Inactive' : 'Active';
      await db.pool.query('UPDATE tbl_staff SET status = ?, super_updated_by = ? WHERE id = ?', [newStatus, req.user?.id || null, staffId]);

      res.status(200).json({ success: true, message: `Status updated to ${newStatus}` });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // 6. Students
  static async getStudents(req, res) {
    try {
      const [rows] = await db.pool.query(
        'SELECT s.*, sch.name as school_name, b.batch_code FROM tbl_students s LEFT JOIN tbl_schools sch ON s.school_id = sch.id LEFT JOIN tbl_batches b ON s.batch_id = b.batch_id ORDER BY s.student_id DESC'
      );
      res.status(200).json({ success: true, data: rows });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async toggleStudentStatus(req, res) {
    try {
      const studentId = parseInt(req.params.id, 10);
      const [rows] = await db.pool.query('SELECT status FROM tbl_students WHERE student_id = ?', [studentId]);
      if (rows.length === 0) return res.status(404).json({ success: false, message: 'Student not found' });

      const newStatus = rows[0].status === 'Active' ? 'Inactive' : 'Active';
      await db.pool.query('UPDATE tbl_students SET status = ?, student_status = ? WHERE student_id = ?', [newStatus, newStatus, studentId]);

      res.status(200).json({ success: true, message: `Status updated to ${newStatus}` });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // 7. Parents
  static async getParents(req, res) {
    try {
      const [rows] = await db.pool.query('SELECT * FROM tbl_parent ORDER BY parent_id DESC');
      res.status(200).json({ success: true, data: rows });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async toggleParentStatus(req, res) {
    try {
      const parentId = parseInt(req.params.id, 10);
      const [rows] = await db.pool.query('SELECT status FROM tbl_parent WHERE parent_id = ?', [parentId]);
      if (rows.length === 0) return res.status(404).json({ success: false, message: 'Parent not found' });

      const newStatus = rows[0].status === 'Active' ? 'Inactive' : 'Active';
      await db.pool.query('UPDATE tbl_parent SET status = ? WHERE parent_id = ?', [newStatus, parentId]);

      res.status(200).json({ success: true, message: `Status updated to ${newStatus}` });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // 8. Academic Years
  static async getAcademicYears(req, res) {
    try {
      const [rows] = await db.pool.query(
        'SELECT y.*, s.name as school_name, b.branch_name FROM tbl_academic_years y LEFT JOIN tbl_schools s ON y.school_id = s.id LEFT JOIN tbl_school_branches b ON y.branch_id = b.id ORDER BY y.academic_year_id DESC'
      );
      res.status(200).json({ success: true, data: rows });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async createAcademicYear(req, res) {
    try {
      const { school_id, branch_id, academic_year_name, start_date, end_date } = req.body;
      const created_by = req.user?.id || null;

      const [result] = await db.pool.query(
        'INSERT INTO tbl_academic_years (school_id, branch_id, academic_year_name, start_date, end_date, created_by) VALUES (?, ?, ?, ?, ?, ?)',
        [school_id, branch_id, academic_year_name, start_date, end_date, created_by]
      );

      res.status(201).json({ success: true, data: { academic_year_id: result.insertId } });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async toggleAcademicYearStatus(req, res) {
    try {
      const yearId = parseInt(req.params.id, 10);
      const [rows] = await db.pool.query('SELECT status FROM tbl_academic_years WHERE academic_year_id = ?', [yearId]);
      if (rows.length === 0) return res.status(404).json({ success: false, message: 'Academic Year not found' });

      const newStatus = rows[0].status === 'Active' ? 'Inactive' : 'Active';
      // Set all other active to inactive if turning this active
      if (newStatus === 'Active') {
        await db.pool.query('UPDATE tbl_academic_years SET status = "Inactive", is_current = 0');
      }
      await db.pool.query('UPDATE tbl_academic_years SET status = ?, is_current = ? WHERE academic_year_id = ?', [newStatus, newStatus === 'Active' ? 1 : 0, yearId]);

      res.status(200).json({ success: true, message: `Status updated to ${newStatus}` });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // 9. Academic Sessions
  static async getAcademicSessions(req, res) {
    try {
      const [rows] = await db.pool.query(
        'SELECT s.*, y.academic_year_name FROM tbl_academic_year_sessions s JOIN tbl_academic_years y ON s.academic_year_id = y.academic_year_id ORDER BY s.session_id DESC'
      );
      res.status(200).json({ success: true, data: rows });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async createAcademicSession(req, res) {
    try {
      const { academic_year_id, session_name, session_number, start_date, end_date } = req.body;
      const created_by = req.user?.id || null;

      const [result] = await db.pool.query(
        'INSERT INTO tbl_academic_year_sessions (academic_year_id, session_name, session_number, start_date, end_date, created_by) VALUES (?, ?, ?, ?, ?, ?)',
        [academic_year_id, session_name, session_number, start_date || null, end_date || null, created_by]
      );

      res.status(201).json({ success: true, data: { session_id: result.insertId } });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async setCurrentSession(req, res) {
    try {
      const sessionId = parseInt(req.params.id, 10);
      const [sessionInfo] = await db.pool.query('SELECT academic_year_id FROM tbl_academic_year_sessions WHERE session_id = ?', [sessionId]);
      if (sessionInfo.length === 0) return res.status(404).json({ success: false, message: 'Session not found' });

      await db.pool.query('UPDATE tbl_academic_year_sessions SET is_current = 0 WHERE academic_year_id = ?', [sessionInfo[0].academic_year_id]);
      await db.pool.query('UPDATE tbl_academic_year_sessions SET is_current = 1 WHERE session_id = ?', [sessionId]);

      res.status(200).json({ success: true, message: 'Session designated as current term' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // 10. Classes
  static async getClasses(req, res) {
    try {
      const [rows] = await db.pool.query(
        'SELECT sc.school_class_id, sc.class_id, c.class_name, sch.name as school_name, b.branch_name, sc.student_capacity, sc.location, sc.status FROM tbl_school_classes sc JOIN tbl_classes c ON sc.class_id = c.class_id LEFT JOIN tbl_schools sch ON sc.school_id = sch.id LEFT JOIN tbl_school_branches b ON sc.branch_id = b.id ORDER BY sc.school_class_id DESC'
      );
      res.status(200).json({ success: true, data: rows });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async createClass(req, res) {
    try {
      const { class_name, school_id, branch_id, student_capacity, location } = req.body;
      const created_by = req.user?.id || null;

      // Check if class exists in tbl_classes, otherwise create
      let [classCheck] = await db.pool.query('SELECT class_id FROM tbl_classes WHERE class_name = ?', [class_name]);
      let class_id;
      if (classCheck.length === 0) {
        const [classInsert] = await db.pool.query('INSERT INTO tbl_classes (class_name, created_by) VALUES (?, ?)', [class_name, created_by]);
        class_id = classInsert.insertId;
      } else {
        class_id = classCheck[0].class_id;
      }

      const [result] = await db.pool.query(
        'INSERT INTO tbl_school_classes (class_id, school_id, branch_id, location, student_capacity, created_by) VALUES (?, ?, ?, ?, ?, ?)',
        [class_id, school_id, branch_id, location || null, student_capacity || 40, created_by]
      );

      res.status(201).json({ success: true, data: { school_class_id: result.insertId } });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async toggleClassStatus(req, res) {
    try {
      const schoolClassId = parseInt(req.params.id, 10);
      const [rows] = await db.pool.query('SELECT status FROM tbl_school_classes WHERE school_class_id = ?', [schoolClassId]);
      if (rows.length === 0) return res.status(404).json({ success: false, message: 'Class not found' });

      const newStatus = rows[0].status === 'Active' ? 'Inactive' : 'Active';
      await db.pool.query('UPDATE tbl_school_classes SET status = ? WHERE school_class_id = ?', [newStatus, schoolClassId]);

      res.status(200).json({ success: true, message: `Status updated to ${newStatus}` });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // 11. Sections
  static async getSections(req, res) {
    try {
      const [rows] = await db.pool.query('SELECT * FROM tbl_sections ORDER BY section_id DESC');
      res.status(200).json({ success: true, data: rows });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async createSection(req, res) {
    try {
      const { section_name, room_number } = req.body;
      const created_by = req.user?.id || null;

      const [result] = await db.pool.query(
        'INSERT INTO tbl_sections (section_name, room_number, created_by) VALUES (?, ?, ?)',
        [section_name, room_number || null, created_by]
      );

      res.status(201).json({ success: true, data: { section_id: result.insertId } });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async toggleSectionStatus(req, res) {
    try {
      const sectionId = parseInt(req.params.id, 10);
      const [rows] = await db.pool.query('SELECT status FROM tbl_sections WHERE section_id = ?', [sectionId]);
      if (rows.length === 0) return res.status(404).json({ success: false, message: 'Section not found' });

      const newStatus = rows[0].status === 'Active' ? 'Inactive' : 'Active';
      await db.pool.query('UPDATE tbl_sections SET status = ? WHERE section_id = ?', [newStatus, sectionId]);

      res.status(200).json({ success: true, message: `Status updated to ${newStatus}` });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // 12. Batches
  static async getBatches(req, res) {
    try {
      const [rows] = await db.pool.query(
        'SELECT b.*, c.class_name, sec.section_name, y.academic_year_name, t.name as teacher_name FROM tbl_batches b JOIN tbl_school_classes sc ON b.school_class_id = sc.school_class_id JOIN tbl_classes c ON sc.class_id = c.class_id JOIN tbl_sections sec ON b.section_id = sec.section_id JOIN tbl_academic_years y ON b.academic_year_id = y.academic_year_id LEFT JOIN tbl_staff t ON b.teacher_id = t.id ORDER BY b.batch_id DESC'
      );
      res.status(200).json({ success: true, data: rows });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async createBatch(req, res) {
    try {
      const { batch_code, school_class_id, academic_year_id, section_id, teacher_id } = req.body;
      const created_by = req.user?.id || null;

      const [result] = await db.pool.query(
        'INSERT INTO tbl_batches (batch_code, school_class_id, academic_year_id, section_id, teacher_id, created_by) VALUES (?, ?, ?, ?, ?, ?)',
        [batch_code, school_class_id, academic_year_id, section_id, teacher_id || null, created_by]
      );

      res.status(201).json({ success: true, data: { batch_id: result.insertId } });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async toggleBatchStatus(req, res) {
    try {
      const batchId = parseInt(req.params.id, 10);
      const [rows] = await db.pool.query('SELECT status FROM tbl_batches WHERE batch_id = ?', [batchId]);
      if (rows.length === 0) return res.status(404).json({ success: false, message: 'Batch not found' });

      const newStatus = rows[0].status === 'Active' ? 'Inactive' : 'Active';
      await db.pool.query('UPDATE tbl_batches SET status = ? WHERE batch_id = ?', [newStatus, batchId]);

      res.status(200).json({ success: true, message: `Status updated to ${newStatus}` });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // 13. Staff Types
  static async getStaffTypes(req, res) {
    try {
      const [rows] = await db.pool.query('SELECT * FROM tbl_staff_types ORDER BY id DESC');
      res.status(200).json({ success: true, data: rows });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async createStaffType(req, res) {
    try {
      const { name, description } = req.body;
      const created_by = req.user?.id || null;

      const [result] = await db.pool.query(
        'INSERT INTO tbl_staff_types (type_name, description, created_by) VALUES (?, ?, ?)',
        [name, description || null, created_by]
      );

      res.status(201).json({ success: true, data: { id: result.insertId } });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async toggleStaffTypeStatus(req, res) {
    try {
      const typeId = parseInt(req.params.id, 10);
      const [rows] = await db.pool.query('SELECT status FROM tbl_staff_types WHERE id = ?', [typeId]);
      if (rows.length === 0) return res.status(404).json({ success: false, message: 'Type not found' });

      const newStatus = rows[0].status === 'Active' ? 'Inactive' : 'Active';
      await db.pool.query('UPDATE tbl_staff_types SET status = ? WHERE id = ?', [newStatus, typeId]);

      res.status(200).json({ success: true, message: `Status updated to ${newStatus}` });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // 14. Departments
  static async getDepartments(req, res) {
    try {
      const [rows] = await db.pool.query('SELECT * FROM tbl_staff_departments ORDER BY id DESC');
      res.status(200).json({ success: true, data: rows });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async createDepartment(req, res) {
    try {
      const { name, description } = req.body;
      const created_by = req.user?.id || null;

      const [result] = await db.pool.query(
        'INSERT INTO tbl_staff_departments (department_name, description, created_by) VALUES (?, ?, ?)',
        [name, description || null, created_by]
      );

      res.status(201).json({ success: true, data: { id: result.insertId } });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async toggleDepartmentStatus(req, res) {
    try {
      const deptId = parseInt(req.params.id, 10);
      const [rows] = await db.pool.query('SELECT status FROM tbl_staff_departments WHERE id = ?', [deptId]);
      if (rows.length === 0) return res.status(404).json({ success: false, message: 'Department not found' });

      const newStatus = rows[0].status === 'Active' ? 'Inactive' : 'Active';
      await db.pool.query('UPDATE tbl_staff_departments SET status = ? WHERE id = ?', [newStatus, deptId]);

      res.status(200).json({ success: true, message: `Status updated to ${newStatus}` });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // 15. Roles
  static async getRoles(req, res) {
    try {
      const [rows] = await db.pool.query('SELECT * FROM tbl_roles ORDER BY role_id DESC');
      res.status(200).json({ success: true, data: rows });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async createRole(req, res) {
    try {
      const { name } = req.body;
      const created_by = req.user?.id || null;

      const [result] = await db.pool.query(
        'INSERT INTO tbl_roles (role_name, created_by) VALUES (?, ?)',
        [name, created_by]
      );

      res.status(201).json({ success: true, data: { role_id: result.insertId } });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async toggleRoleStatus(req, res) {
    try {
      const roleId = parseInt(req.params.id, 10);
      const [rows] = await db.pool.query('SELECT status FROM tbl_roles WHERE role_id = ?', [roleId]);
      if (rows.length === 0) return res.status(404).json({ success: false, message: 'Role not found' });

      const newStatus = rows[0].status === 'Active' ? 'Inactive' : 'Active';
      await db.pool.query('UPDATE tbl_roles SET status = ? WHERE role_id = ?', [newStatus, roleId]);

      res.status(200).json({ success: true, message: `Status updated to ${newStatus}` });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // 16. Modules
  static async getModules(req, res) {
    try {
      const [rows] = await db.pool.query('SELECT * FROM tbl_modules ORDER BY id DESC');
      res.status(200).json({ success: true, data: rows });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async createModule(req, res) {
    try {
      const { name } = req.body;
      const created_by = req.user?.id || null;

      const [result] = await db.pool.query(
        'INSERT INTO tbl_modules (module_name, created_by) VALUES (?, ?)',
        [name, created_by]
      );

      res.status(201).json({ success: true, data: { id: result.insertId } });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async toggleModuleStatus(req, res) {
    try {
      const moduleId = parseInt(req.params.id, 10);
      const [rows] = await db.pool.query('SELECT status FROM tbl_modules WHERE id = ?', [moduleId]);
      if (rows.length === 0) return res.status(404).json({ success: false, message: 'Module not found' });

      const newStatus = rows[0].status === 'Active' ? 'Inactive' : 'Active';
      await db.pool.query('UPDATE tbl_modules SET status = ? WHERE id = ?', [newStatus, moduleId]);

      res.status(200).json({ success: true, message: `Status updated to ${newStatus}` });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // 17. Permissions Matrix
  static async getPermissionsMatrix(req, res) {
    try {
      const [rows] = await db.pool.query(
        'SELECT p.*, r.role_name, m.module_name FROM tbl_role_module_permissions p JOIN tbl_roles r ON p.role_id = r.role_id JOIN tbl_modules m ON p.module_id = m.id ORDER BY p.id DESC'
      );
      res.status(200).json({ success: true, data: rows });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async updatePermissionNode(req, res) {
    try {
      const nodeId = parseInt(req.params.id, 10);
      const { can_read, can_write, can_update, can_delete, can_more } = req.body;
      const updated_by = req.user?.id || null;

      await db.pool.query(
        'UPDATE tbl_role_module_permissions SET can_read = ?, can_write = ?, can_update = ?, can_delete = ?, can_more = ?, updated_by = ? WHERE id = ?',
        [can_read ? 1 : 0, can_write ? 1 : 0, can_update ? 1 : 0, can_delete ? 1 : 0, can_more ? 1 : 0, updated_by, nodeId]
      );

      res.status(200).json({ success: true, message: 'Permissions node updated successfully' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = MasterController;
