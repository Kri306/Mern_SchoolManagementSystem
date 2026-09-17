const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  console.log('--- Seeding Data for Staff Dashboard ---');

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sms_db'
  });

try {
    // 1. Get School ID and Branch IDs for Jeevan Bharti School
    const [schools] = await conn.query("SELECT id FROM tbl_schools WHERE school_code = 'JEE011'");
    if (schools.length === 0) {
      console.log('School JEE011 not found. Please register it first.');
      await conn.end();
      return;
    }
    const schoolId = schools[0].id;
    console.log('School ID:', schoolId);

    const [branches] = await conn.query("SELECT id, branch_name FROM tbl_school_branches WHERE school_id = ?", [schoolId]);
    if (branches.length === 0) {
      console.log('Branches not found for school.');
      await conn.end();
      return;
    }
    const branch1Id = branches[0].id; // South Campus
    const branch2Id = branches[1]?.id || branch1Id; // North Campus
    console.log('Branch 1 ID (South):', branch1Id);
    console.log('Branch 2 ID (North):', branch2Id);

    // Get Teacher IDs
    const [staff] = await conn.query("SELECT id, name FROM tbl_staff WHERE school_id = ?", [schoolId]);
    console.log('Staff list:', staff);
    const teacherId = staff[0]?.id; // John Doe
    if (!teacherId) {
      console.log('No staff found. Please register staff first.');
      await conn.end();
      return;
    }

    // Disable Foreign Key Checks for clean insertions
    await conn.query("SET FOREIGN_KEY_CHECKS = 0");

    // Clean up existing data for schoolId to allow clean seeding
    console.log('Cleaning up existing school classes, batches, students for clean seed...');
    await conn.query("DELETE FROM tbl_students WHERE s  chool_id = ?", [schoolId]);
    await conn.query("DELETE FROM tbl_batches WHERE teacher_id IN (SELECT id FROM tbl_staff WHERE school_id = ?)", [schoolId]);
    await conn.query("DELETE FROM tbl_school_classes WHERE school_id = ?", [schoolId]);
    await conn.query("DELETE FROM tbl_school_mediums WHERE school_id = ?", [schoolId]);
    
    // Clean sessions and years
    const [ayIds] = await conn.query("SELECT academic_year_id FROM tbl_academic_years WHERE school_id = ?", [schoolId]);
    for (const row of ayIds) {
      await conn.query("DELETE FROM tbl_academic_year_sessions WHERE academic_year_id = ?", [row.academic_year_id]);
    }
    await conn.query("DELETE FROM tbl_academic_years WHERE school_id = ?", [schoolId]);

    // 2. Insert Academic Year
    console.log('Inserting Academic Year...');
    const [ayRes] = await conn.query(
      `INSERT INTO tbl_academic_years (school_id, branch_id, academic_year_name, semester, start_date, end_date, status)
       VALUES (?, ?, '2026-27', 'First Semester', '2026-06-01', '2027-05-31', 'Active')`,
      [schoolId, branch1Id]
    );
    const ayId = ayRes.insertId;
    console.log('Academic Year ID:', ayId);

    // 3. Insert Academic Year Session
    console.log('Inserting Academic Year Session...');
    await conn.query(
      `INSERT INTO tbl_academic_year_sessions (academic_year_id, session_name, session_number, start_date, end_date, is_current, status)
       VALUES (?, 'Term 1', 'S-01', '2026-06-01', '2026-11-30', 1, 'Active')`,
      [ayId]
    );

    // 4. Insert School Medium
    console.log('Inserting School Medium...');
    // Seed master medium first
    await conn.query(`INSERT INTO tbl_master_mediums (master_medium_id, medium_name) VALUES (1, 'English') ON DUPLICATE KEY UPDATE medium_name='English'`);
    
    await conn.query(
      `INSERT INTO tbl_school_mediums (school_id, master_medium_id, custom_medium_name, approval_status, status)
       VALUES (?, 1, 'English Medium', 'Approved', 'Active')`,
      [schoolId]
    );

    // 5. Insert Classes and Sections
    console.log('Inserting Classes and Sections...');
    await conn.query("INSERT INTO tbl_classes (class_id, class_name, display_order) VALUES (10, 'Class 10', 10) ON DUPLICATE KEY UPDATE class_name='Class 10'");
    await conn.query("INSERT INTO tbl_classes (class_id, class_name, display_order) VALUES (9, 'Class 9', 9) ON DUPLICATE KEY UPDATE class_name='Class 9'");
    
    await conn.query("INSERT IN TO tbl_sections (section_id, section_name, room_number) VALUES (1, 'Section A', 'R-101') ON DUPLICATE KEY UPDATE section_name='Section A'");
    await conn.query("INSERT INTO tbl_sections (section_id, section_name, room_number) VALUES (2, 'Section B', 'R-102') ON DUPLICATE KEY UPDATE section_name='Section B'");

    // 6. Map School Classes
    console.log('Mapping School Classes...');
    const [sc1Res] = await conn.query(
      `INSERT INTO tbl_school_classes (class_id, school_id, branch_id, location, student_capacity, status)
       VALUES (10, ?, ?, 'Building A - Room 101', 40, 'Active')`,
      [schoolId, branch1Id]
    );
    const sc1Id = sc1Res.insertId;

    const [sc2Res] = await conn.query(
      `INSERT INTO tbl_school_classes (class_id, school_id, branch_id, location, student_capacity, status)
       VALUES (9, ?, ?, 'Building B - Room 102', 45, 'Active')`,
      [schoolId, branch2Id]
    );
    const sc2Id = sc2Res.insertId;

    // 7. Insert Batches
    console.log('Inserting Batches...');
    const [b1Res] = await conn.query(
      `INSERT INTO tbl_batches (batch_code, school_class_id, academic_year_id, section_id, teacher_id, status)
       VALUES ('B001', ?, ?, 1, ?, 'Active')`,
      [sc1Id, ayId, teacherId]
    );
    const batch1Id = b1Res.insertId;

    const [b2Res] = await conn.query(
      `INSERT INTO tbl_batches (batch_code, school_class_id, academic_year_id, section_id, teacher_id, status)
       VALUES ('B002', ?, ?, 2, ?, 'Active')`,
      [sc2Id, ayId, teacherId]
    );
    const batch2Id = b2Res.insertId;

    // 8. Insert Students
    console.log('Inserting Students...');
    const parent1Details = JSON.stringify({ father_name: 'Robert Smith', father_phone: '+919999911111' });
    const parent2Details = JSON.stringify({ father_name: 'James Miller', father_phone: '+919999922222' });
    const parent3Details = JSON.stringify({ father_name: 'Chris Watson', father_phone: '+919999933333' });

    await conn.query(
      `INSERT INTO tbl_students (school_id, role_id, student_unique_id, admission_number, name, email, phone_number, batch_id, status, student_status, student_parent_details)
       VALUES (?, 4, 'ST001', 'ADM001', 'Alice Smith', 'alice@student.com', '+919876543201', ?, 'Active', 'Studying', ?)`,
      [schoolId, batch1Id, parent1Details]
    );

    await conn.query(
      `INSERT INTO tbl_students (school_id, role_id, student_unique_id, admission_number, name, email, phone_number, batch_id, status, student_status, student_parent_details)
       VALUES (?, 4, 'ST002', 'ADM002', 'David Miller', 'david@student.com', '+919876543202', ?, 'Active', 'Studying', ?)`,
      [schoolId, batch1Id, parent2Details]
    );

    await conn.query(
      `INSERT INTO tbl_students (school_id, role_id, student_unique_id, admission_number, name, email, phone_number, batch_id, status, student_status, student_parent_details)
       VALUES (?, 4, 'ST003', 'ADM003', 'Emma Watson', 'emma@student.com', '+919876543203', ?, 'Active', 'Studying', ?)`,
      [schoolId, batch2Id, parent3Details]
    );

    // 9. Seed Modules and Permissions
    console.log('Seeding Modules and Permissions...');
    const modules = [
      { id: 1, name: 'Dashboard' },
      { id: 2, name: 'Profile' },
      { id: 3, name: 'Classes' },
      { id: 4, name: 'Students' },
      { id: 5, name: 'School Info' },
      { id: 6, name: 'Academic Years' },
      { id: 7, name: 'Permissions' },
      { id: 8, name: 'Settings' }
    ];
    for (const m of modules) {
      await conn.query(
        "INSERT INTO tbl_modules (id, module_name, status) VALUES (?, ?, 'Active') ON DUPLICATE KEY UPDATE status='Active'",
        [m.id, m.name]
      );
      
      // Seed permissions for Role ID 3 (Staff)
      await conn.query(
        `INSERT INTO tbl_role_module_permissions (role_id, module_id, can_read, can_write, can_update, can_delete, can_more)
         VALUES (3, ?, 1, 1, 1, 0, 0)
         ON DUPLICATE KEY UPDATE can_read=1, can_write=1, can_update=1`,
        [m.id]
      );
    }

    await conn.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log('\n[SUCCESS] Staff Dashboard Data Seeded Successfully!');
  } catch (err) {
    console.error('[FAILED] Seeding encountered error:', err.message);
  } finally {
    await conn.end();
  }
}

run().catch(console.error);
