

CREATE DATABASE IF NOT EXISTS sms_db;
USE sms_db;


-- 1. TABLE: tbl_roles
CREATE TABLE tbl_roles (
  role_id INT AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(50) DEFAULT 'Active',
  created_by INT NULL,
  updated_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 1.1 TABLE: tbl_users (Authentication)
CREATE TABLE tbl_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role_id INT NOT NULL,
  status VARCHAR(50) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES tbl_roles(role_id)
);

-- 2. tbl_supar_admin
CREATE TABLE tbl_supar_admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone_number VARCHAR(50) NULL,
  password VARCHAR(255) NOT NULL,
  role_id INT NOT NULL,
  status VARCHAR(50) DEFAULT 'Active',
  created_by INT NULL,
  updated_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES tbl_roles(role_id)
);

-- 3. tbl_schools
CREATE TABLE tbl_schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  school_code VARCHAR(100) NOT NULL UNIQUE,
  address TEXT NULL,
  contact_number VARCHAR(50) NULL,
  email_id VARCHAR(255) NULL,
  logo VARCHAR(255) NULL,
  website_link VARCHAR(255) NULL,
  working_hours VARCHAR(100) NULL,
  status VARCHAR(50) DEFAULT 'Active',
  created_by INT NULL,
  updated_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  bank_details TEXT NULL,
  telegram_channel_id VARCHAR(100) NULL,
  FOREIGN KEY (created_by) REFERENCES tbl_supar_admin(id),
  FOREIGN KEY (updated_by) REFERENCES tbl_supar_admin(id)
);

-- 4. tbl_school_admin
CREATE TABLE tbl_school_admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  school_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone_number VARCHAR(50) NULL,
  password VARCHAR(255) NOT NULL,
  role_id INT NOT NULL,
  status VARCHAR(50) DEFAULT 'Active',
  registration_status VARCHAR(50) DEFAULT 'Pending',
  profile_pic VARCHAR(255) NULL,
  created_by INT NULL,
  updated_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES tbl_users(id),
  FOREIGN KEY (school_id) REFERENCES tbl_schools(id),
  FOREIGN KEY (role_id) REFERENCES tbl_roles(role_id)
);

-- 5. tbl_school_branches
CREATE TABLE tbl_school_branches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  school_id INT NOT NULL,
  branch_name VARCHAR(255) NOT NULL,
  branch_code VARCHAR(100) NOT NULL UNIQUE,
  address TEXT NULL,
  contact_person VARCHAR(255) NULL,
  contact_number VARCHAR(50) NULL,
  branch_email VARCHAR(255) NULL,
  principal_name VARCHAR(255) NULL,
  is_main_branch TINYINT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'Active',
  created_by INT NULL,
  updated_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  short_branch_code VARCHAR(50) NULL,
  FOREIGN KEY (school_id) REFERENCES tbl_schools(id)
);

-- 6. tbl_classes
CREATE TABLE tbl_classes (
  class_id INT AUTO_INCREMENT PRIMARY KEY,
  class_name VARCHAR(255) NOT NULL,
  display_order INT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT NULL,
  updated_by INT NULL
);

-- 7. tbl_school_classes
CREATE TABLE tbl_school_classes (
  school_class_id INT AUTO_INCREMENT PRIMARY KEY,
  class_id INT NOT NULL,
  school_id INT NOT NULL,
  branch_id INT NOT NULL,
  location VARCHAR(255) NULL,
  student_capacity INT DEFAULT 40,
  status VARCHAR(50) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT NULL,
  updated_by INT NULL,
  FOREIGN KEY (class_id) REFERENCES tbl_classes(class_id),
  FOREIGN KEY (school_id) REFERENCES tbl_schools(id),
  FOREIGN KEY (branch_id) REFERENCES tbl_school_branches(id)
);

-- 8. tbl_sections
CREATE TABLE tbl_sections (
  section_id INT AUTO_INCREMENT PRIMARY KEY,
  section_name VARCHAR(255) NOT NULL,
  room_number VARCHAR(50) NULL,
  status VARCHAR(50) DEFAULT 'Active',
  created_by INT NULL,
  updated_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 9. tbl_academic_years
CREATE TABLE tbl_academic_years (
  academic_year_id INT AUTO_INCREMENT PRIMARY KEY,
  school_id INT NOT NULL,
  branch_id INT NOT NULL,
  academic_year_name VARCHAR(255) NOT NULL,
  semester VARCHAR(100) NULL,
  start_date DATE NULL,
  end_date DATE NULL,
  is_current TINYINT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'Active',
  created_by INT NULL,
  updated_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (school_id) REFERENCES tbl_schools(id),
  FOREIGN KEY (branch_id) REFERENCES tbl_school_branches(id)
);

-- 10. tbl_academic_year_sessions
CREATE TABLE tbl_academic_year_sessions (
  session_id INT AUTO_INCREMENT PRIMARY KEY,
  academic_year_id INT NOT NULL,
  session_name VARCHAR(255) NOT NULL,
  session_number VARCHAR(50) NULL,
  start_date DATE NULL,
  end_date DATE NULL,
  is_current TINYINT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'Active',
  created_by INT NULL,
  updated_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (academic_year_id) REFERENCES tbl_academic_years(academic_year_id)
);

-- 11. tbl_master_mediums
CREATE TABLE tbl_master_mediums (
  master_medium_id INT AUTO_INCREMENT PRIMARY KEY,
  medium_name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  requested_by_school_id INT NULL,
  approval_status VARCHAR(50) DEFAULT 'Pending',
  status VARCHAR(50) DEFAULT 'Active',
  created_by INT NULL,
  updated_by INT NULL,
  approved_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  approved_at TIMESTAMP NULL,
  FOREIGN KEY (requested_by_school_id) REFERENCES tbl_schools(id),
  FOREIGN KEY (created_by) REFERENCES tbl_supar_admin(id),
  FOREIGN KEY (updated_by) REFERENCES tbl_supar_admin(id),
  FOREIGN KEY (approved_by) REFERENCES tbl_supar_admin(id)
);

-- 12. tbl_school_mediums
CREATE TABLE tbl_school_mediums (
  school_medium_id INT AUTO_INCREMENT PRIMARY KEY,
  school_id INT NOT NULL,
  master_medium_id INT NOT NULL,
  custom_medium_name VARCHAR(255) NULL,
  approval_status VARCHAR(50) DEFAULT 'Pending',
  status VARCHAR(50) DEFAULT 'Active',
  created_by INT NULL,
  updated_by INT NULL,
  approved_by INT NULL,
  approved_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (school_id) REFERENCES tbl_schools(id),
  FOREIGN KEY (master_medium_id) REFERENCES tbl_master_mediums(master_medium_id),
  FOREIGN KEY (approved_by) REFERENCES tbl_supar_admin(id)
);

-- 13. tbl_master_school_boards
CREATE TABLE tbl_master_school_boards (
  master_board_id INT AUTO_INCREMENT PRIMARY KEY,
  board_name VARCHAR(255) NOT NULL,
  board_logo VARCHAR(255) NULL,
  description TEXT NULL,
  requested_by INT NULL,
  approval_status VARCHAR(50) DEFAULT 'Pending',
  status VARCHAR(50) DEFAULT 'Active',
  created_by INT NULL,
  updated_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (requested_by) REFERENCES tbl_schools(id),
  FOREIGN KEY (created_by) REFERENCES tbl_supar_admin(id),
  FOREIGN KEY (updated_by) REFERENCES tbl_supar_admin(id)
);

-- 14. tbl_school_boards
CREATE TABLE tbl_school_boards (
  school_board_id INT AUTO_INCREMENT PRIMARY KEY,
  school_id INT NOT NULL,
  master_board_id INT NOT NULL,
  custom_board_name VARCHAR(255) NULL,
  custom_board_logo VARCHAR(255) NULL,
  custom_description TEXT NULL,
  request_status VARCHAR(50) DEFAULT 'Pending',
  approved_by INT NULL,
  approved_at TIMESTAMP NULL,
  status VARCHAR(50) DEFAULT 'Active',
  created_by INT NULL,
  updated_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (school_id) REFERENCES tbl_schools(id),
  FOREIGN KEY (master_board_id) REFERENCES tbl_master_school_boards(master_board_id),
  FOREIGN KEY (approved_by) REFERENCES tbl_supar_admin(id)
);

-- 15. tbl_staff_departments
CREATE TABLE tbl_staff_departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  logo VARCHAR(255) NULL,
  status VARCHAR(50) DEFAULT 'Active',
  created_by INT NULL,
  updated_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES tbl_supar_admin(id),
  FOREIGN KEY (updated_by) REFERENCES tbl_supar_admin(id)
);

-- 16. tbl_staff_types
CREATE TABLE tbl_staff_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type_name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  status VARCHAR(50) DEFAULT 'Active',
  created_by INT NULL,
  updated_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES tbl_supar_admin(id),
  FOREIGN KEY (updated_by) REFERENCES tbl_supar_admin(id)
);

-- 17. tbl_staff;
CREATE TABLE tbl_staff (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone_number VARCHAR(50) NULL,
  profile_pic VARCHAR(255) NULL,
  school_id INT NULL,
  branch_id INT NULL,
  staff_type_id INT NULL,
  custom_staff_type VARCHAR(255) NULL,
  department_id INT NULL,
  office_location VARCHAR(255) NULL,
  custom_staff_department VARCHAR(255) NULL,
  qualification VARCHAR(255) NULL,
  joining_date DATE NULL,
  experience VARCHAR(100) NULL,
  salary DECIMAL(10, 2) NULL,
  performance_record TEXT NULL,
  status VARCHAR(50) DEFAULT 'Active',
  created_by INT NULL,
  updated_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  role_id INT NOT NULL,
  registration_status VARCHAR(50) DEFAULT 'Pending',
  school_admin_id INT NULL,
  super_created_by INT NULL,
  super_updated_by INT NULL,
  password VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES tbl_users(id),
  FOREIGN KEY (school_id) REFERENCES tbl_schools(id),
  FOREIGN KEY (branch_id) REFERENCES tbl_school_branches(id),
  FOREIGN KEY (staff_type_id) REFERENCES tbl_staff_types(id),
  FOREIGN KEY (department_id) REFERENCES tbl_staff_departments(id),
  FOREIGN KEY (role_id) REFERENCES tbl_roles(role_id),
  FOREIGN KEY (super_created_by) REFERENCES tbl_supar_admin(id),
  FOREIGN KEY (super_updated_by) REFERENCES tbl_supar_admin(id)
);

-- 18. tbl_batches
CREATE TABLE tbl_batches (
  batch_id INT AUTO_INCREMENT PRIMARY KEY,
  batch_code VARCHAR(100) NOT NULL UNIQUE,
  school_class_id INT NOT NULL,
  academic_year_id INT NOT NULL,
  section_id INT NOT NULL,
  teacher_id INT NULL,
  school_medium_id INT NULL,
  start_time TIME NULL,
  end_time TIME NULL,
  duration_minutes INT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'Active',
  created_by INT NULL,
  updated_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (school_class_id) REFERENCES tbl_school_classes(school_class_id),
  FOREIGN KEY (academic_year_id) REFERENCES tbl_academic_years(academic_year_id),
  FOREIGN KEY (section_id) REFERENCES tbl_sections(section_id),
  FOREIGN KEY (teacher_id) REFERENCES tbl_staff(id)
);

-- 19. tbl_parent
CREATE TABLE tbl_parent (
  parent_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  role_id INT DEFAULT 5,
  school_id INT NULL,
  branch_id INT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NULL,
  phone VARCHAR(50) NOT NULL,
  password VARCHAR(255) NULL,
  otp VARCHAR(10) NULL,
  parent_details TEXT NULL,
  status VARCHAR(50) DEFAULT 'Active',
  created_by INT NULL,
  updated_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  telegram_chat_id VARCHAR(100) NULL,
  FOREIGN KEY (user_id) REFERENCES tbl_users(id),
  FOREIGN KEY (role_id) REFERENCES tbl_roles(role_id),
  FOREIGN KEY (school_id) REFERENCES tbl_schools(id),
  FOREIGN KEY (branch_id) REFERENCES tbl_school_branches(id)
);

-- 20. tbl_students
CREATE TABLE tbl_students (
  student_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  school_id INT NOT NULL,
  role_id INT NOT NULL,
  student_unique_id VARCHAR(100) NOT NULL UNIQUE,
  admission_number VARCHAR(100) NOT NULL,
  gr_number VARCHAR(100) NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NULL,
  password VARCHAR(255) NULL,
  phone_number VARCHAR(50) NULL,
  admission_date DATE NULL,
  roll_number VARCHAR(50) NULL,
  dob DATE NULL,
  gender VARCHAR(50) NULL,
  blood_group VARCHAR(20) NULL,
  address TEXT NULL,
  pincode VARCHAR(20) NULL,
  emergency_contact_number VARCHAR(50) NULL,
  documents TEXT NULL,
  student_parent_details TEXT NULL,
  student_status VARCHAR(50) DEFAULT 'Active',
  is_fee_exempted TINYINT DEFAULT 0,
  gpa DECIMAL(3, 2) DEFAULT 0.00,
  status VARCHAR(50) DEFAULT 'Active',
  created_by INT NULL,
  updated_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  otp VARCHAR(10) NULL,
  batch_id INT NULL,
  branch_transfer_id INT NULL,
  parent_ids VARCHAR(255) NULL,
  FOREIGN KEY (user_id) REFERENCES tbl_users(id),
  FOREIGN KEY (school_id) REFERENCES tbl_schools(id),
  FOREIGN KEY (role_id) REFERENCES tbl_roles(role_id),
  FOREIGN KEY (batch_id) REFERENCES tbl_batches(batch_id)
);

-- 21. tbl_modules
CREATE TABLE tbl_modules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  module_name VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(50) DEFAULT 'Active',
  created_by INT NULL,
  updated_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 22. tbl_permissions
CREATE TABLE tbl_permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  permission_name VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(50) DEFAULT 'Active',
  created_by INT NULL,
  updated_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 23. tbl_role_module_permissions

CREATE TABLE tbl_role_module_permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role_id INT NOT NULL,
  module_id INT NOT NULL,
  can_read TINYINT DEFAULT 0,
  can_write TINYINT DEFAULT 0,
  can_update TINYINT DEFAULT 0,
  can_delete TINYINT DEFAULT 0,
  can_more TINYINT DEFAULT 0,
  created_by INT NULL,
  updated_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES tbl_roles(role_id),
  FOREIGN KEY (module_id) REFERENCES tbl_modules(id)
);

-- 24. TABLE: tbl_login_history (Login Audit)
CREATE TABLE tbl_login_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45) NULL,
  user_agent TEXT NULL,
  status VARCHAR(50) DEFAULT 'Success',
  failure_reason VARCHAR(255) NULL,
  FOREIGN KEY (user_id) REFERENCES tbl_users(id)
);

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================
-- SEED DATA SETUP
-- ==========================================

INSERT INTO tbl_roles (role_id, role_name, status) VALUES 
(1, 'Super Admin', 'Active'),
(2, 'School Admin', 'Active'),
(3, 'Staff', 'Active'),
(4, 'Student', 'Active'),
(5, 'Parent', 'Active')
ON DUPLICATE KEY UPDATE role_name=VALUES(role_name);

INSERT INTO tbl_supar_admin (id, name, email, phone_number, password, role_id, status) VALUES
(1, 'System Administrator', 'superadmin@sms.com', '+1234567890', '$2a$10$/sV99.WtOyE.vkkkTlU5GOhcBltDR5ImdW5LVtyEOk1DBbedV3rZy', 1, 'Active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Seed Data for Schools and Staff Module
INSERT INTO tbl_schools (id, name, school_code, address, contact_number, email_id, status) VALUES
(2, 'JEEVAN BHARTI SCHOOL', 'JEE011', 'Sayam Sadan, Chunnilal Ghelabhai Shah Road, Surat, GJ', '123123123', 'jeevanbharti@gmail.com', 'Active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Seed School Admin User in tbl_users (email: jeevanbharti@admin.com, password: as in krish admin.com)
INSERT INTO tbl_users (id, username, email, password, role_id, status) VALUES
(3, 'jeevanbharti@admin.com', 'jeevanbharti@admin.com', '$2a$10$N.qJ06jo45lMaofkw/8Lb.7QAkqlKVLtSYwzLeORDnDbp/0Oor7uG', 2, 'Active')
ON DUPLICATE KEY UPDATE email=VALUES(email);

INSERT INTO tbl_school_admin (id, user_id, school_id, name, email, phone_number, password, role_id, status, registration_status) VALUES
(2, 3, 2, 'krish', 'jeevanbharti@admin.com', '9016161518', '$2a$10$N.qJ06jo45lMaofkw/8Lb.7QAkqlKVLtSYwzLeORDnDbp/0Oor7uG', 2, 'Active', 'Approved')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO tbl_school_branches (id, school_id, branch_name, branch_code, address, contact_number, branch_email, status) VALUES
(1, 2, 'Surat Main Branch', 'JEE011-B1', 'Sayam Sadan, Surat, GJ', '123123123', 'surat@jeevanbharti.com', 'Active')
ON DUPLICATE KEY UPDATE branch_name=VALUES(branch_name);

INSERT INTO tbl_staff_types (id, type_name, description, status) VALUES
(1, 'Teaching Staff', 'All teachers and educators', 'Active'),
(2, 'Administrative Staff', 'Accountants, registrars, and office clerks', 'Active'),
(3, 'Support Staff', 'Maintenance, transportation, and auxiliary personnel', 'Active'),
(4, 'Technical Staff', 'IT administrators, technicians, and lab assistants', 'Active'),
(5, 'Management Staff', 'Principal, vice principal, and coordinators', 'Active'),
(6, 'Medical Staff', 'School doctors, nurses, and medical officers', 'Active'),
(7, 'Security Staff', 'Gatekeepers, campus security officers, and guards', 'Active'),
(8, 'Counseling & Welfare', 'School counselors, social workers, and advisors', 'Active')
ON DUPLICATE KEY UPDATE type_name=VALUES(type_name);

INSERT INTO tbl_staff_departments (id, department_name, description, status) VALUES
(1, 'Science Department', 'Physics, Chemistry, Biology, and Environmental sciences', 'Active'),
(2, 'Mathematics Department', 'Core Mathematics and Statistics educators', 'Active'),
(3, 'Languages & Humanities', 'English, Literature, Social Studies, and History', 'Active'),
(4, 'Physical Education & Sports', 'Sports coaching, physical training, and health', 'Active'),
(5, 'Administration & Finance', 'School billing, payroll, human resources, and admissions', 'Active'),
(6, 'IT & Systems Support', 'Network administration, technical support, and labs', 'Active'),
(7, 'Library Services', 'Cataloging, book distribution, and library desks', 'Active'),
(8, 'Creative & Fine Arts', 'Music, painting, theater, and creative crafts', 'Active'),
(9, 'Special Education', 'Support for gifted students and students with learning difficulties', 'Active'),
(10, 'Health & Medical Services', 'Campus clinic operations, first aid, and medical records', 'Active'),
(11, 'Counseling & Guidance', 'Student counseling, career guidance, and mental health', 'Active'),
(12, 'Security & Transport', 'Bus fleet coordination, campus security, and safety audits', 'Active')
ON DUPLICATE KEY UPDATE department_name=VALUES(department_name);

-- Seed Staff User in tbl_users (email: staff@sms.com, password: admin123)
INSERT INTO tbl_users (id, username, email, password, role_id, status) VALUES
(2, 'staff@sms.com', 'staff@sms.com', '$2a$10$/sV99.WtOyE.vkkkTlU5GOhcBltDR5ImdW5LVtyEOk1DBbedV3rZy', 3, 'Active')
ON DUPLICATE KEY UPDATE email=VALUES(email);

-- Seed Staff Profile in tbl_staff
INSERT INTO tbl_staff (id, user_id, name, email, phone_number, school_id, branch_id, staff_type_id, department_id, qualification, experience, salary, role_id, registration_status, password, status) VALUES
(1, 2, 'John Doe', 'staff@sms.com', '9876543210', 2, 1, 1, 1, 'M.Sc. Physics', '5 Years', 50000.00, 3, 'Approved', '$2a$10$/sV99.WtOyE.vkkkTlU5GOhcBltDR5ImdW5LVtyEOk1DBbedV3rZy', 'Active')
ON DUPLICATE KEY UPDATE name=VALUES(name);


-- ==========================================
-- STORED PROCEDURES (SP ONLY CRUD)
-- ==========================================

DELIMITER //

-- SP: Super Admin Login
DROP PROCEDURE IF EXISTS sp_super_admin_login//
CREATE PROCEDURE sp_super_admin_login(
  IN p_email VARCHAR(255)
)
BEGIN
  SELECT id, name, email, password, role_id, status 
  FROM tbl_supar_admin 
  WHERE email = p_email AND status = 'Active';
END//

-- SP: School Admin Login
DROP PROCEDURE IF EXISTS sp_school_admin_login//
CREATE PROCEDURE sp_school_admin_login(
  IN p_email VARCHAR(255)
)
BEGIN
  SELECT 
    sa.id AS id,
    u.id AS user_id,
    sa.name AS name,
    u.email AS email,
    u.password AS password,
    u.role_id AS role_id,
    r.role_name AS role_name,
    u.status AS status,
    sa.registration_status AS registration_status,
    sa.school_id AS school_id,
    sch.name AS school_name,
    sch.school_code AS school_code
  FROM tbl_users u
  INNER JOIN tbl_roles r ON u.role_id = r.role_id
  INNER JOIN tbl_school_admin sa ON u.id = sa.user_id
  LEFT JOIN tbl_schools sch ON sa.school_id = sch.id
  WHERE u.email = p_email AND u.status = 'Active';
END//

-- SP: Staff Login
DROP PROCEDURE IF EXISTS sp_staff_login//
CREATE PROCEDURE sp_staff_login(
  IN p_email VARCHAR(255)
)
BEGIN
  SELECT 
    s.id AS id,
    u.id AS user_id,
    s.name AS name,
    u.email AS email,
    u.password AS password,
    u.role_id AS role_id,
    r.role_name AS role_name,
    u.status AS status,
    s.school_id AS school_id,
    sch.name AS school_name,
    sch.school_code AS school_code,
    s.branch_id AS branch_id,
    b.branch_name AS branch_name,
    b.branch_code AS branch_code,
    COALESCE(st.type_name, s.custom_staff_type) AS staff_type,
    COALESCE(sd.department_name, s.custom_staff_department) AS department_name
  FROM tbl_users u
  INNER JOIN tbl_roles r ON u.role_id = r.role_id
  INNER JOIN tbl_staff s ON u.id = s.user_id
  LEFT JOIN tbl_schools sch ON s.school_id = sch.id
  LEFT JOIN tbl_school_branches b ON s.branch_id = b.id
  LEFT JOIN tbl_staff_types st ON s.staff_type_id = st.id
  LEFT JOIN tbl_staff_departments sd ON s.department_id = sd.id
  WHERE u.email = p_email AND u.status = 'Active';
END//

-- SP: Student/Parent Login
DROP PROCEDURE IF EXISTS sp_student_parent_login//
CREATE PROCEDURE sp_student_parent_login(
  IN p_unique_id VARCHAR(100)
)
BEGIN
  SELECT student_id AS id, name, email, student_unique_id, role_id, status, school_id, batch_id
  FROM tbl_students 
  WHERE student_unique_id = p_unique_id AND status = 'Active';
END//

-- SP: Add School (Super Admin)
DROP PROCEDURE IF EXISTS sp_add_school//
CREATE PROCEDURE sp_add_school(
  IN p_name VARCHAR(255),
  IN p_code VARCHAR(100),
  IN p_address TEXT,
  IN p_contact VARCHAR(50),
  IN p_email VARCHAR(255),
  IN p_logo VARCHAR(255),
  IN p_website VARCHAR(255),
  IN p_working_hours VARCHAR(100),
  IN p_bank_details TEXT,
  IN p_telegram VARCHAR(100),
  IN p_created_by INT
)
BEGIN
  INSERT INTO tbl_schools (name, school_code, address, contact_number, email_id, logo, website_link, working_hours, created_by, bank_details, telegram_channel_id)
  VALUES (p_name, p_code, p_address, p_contact, p_email, p_logo, p_website, p_working_hours, p_created_by, p_bank_details, p_telegram);
  SELECT LAST_INSERT_ID() AS school_id;
END//

-- SP: Get Schools (Super Admin)
DROP PROCEDURE IF EXISTS sp_get_schools//
CREATE PROCEDURE sp_get_schools()
BEGIN
  SELECT id, name, school_code, address, contact_number, email_id, logo, website_link, working_hours, status, bank_details, telegram_channel_id, created_at
  FROM tbl_schools;
END//

-- SP: Create School Admin (Super Admin)
DROP PROCEDURE IF EXISTS sp_add_school_admin//
CREATE PROCEDURE sp_add_school_admin(
  IN p_school_id INT,
  IN p_name VARCHAR(255),
  IN p_email VARCHAR(255),
  IN p_phone VARCHAR(50),
  IN p_password VARCHAR(255),
  IN p_created_by INT
)
BEGIN
  DECLARE v_user_id INT;
  
  -- Insert into tbl_users for Authentication
  INSERT INTO tbl_users (username, email, password, role_id, status)
  VALUES (p_email, p_email, p_password, 2, 'Active');
  
  SET v_user_id = LAST_INSERT_ID();

  INSERT INTO tbl_school_admin (user_id, school_id, name, email, phone_number, password, role_id, status, registration_status, created_by)
  VALUES (v_user_id, p_school_id, p_name, p_email, p_phone, p_password, 2, 'Active', 'Approved', p_created_by);
  SELECT LAST_INSERT_ID() AS admin_id;
END//

-- SP: Get School Admins (Super Admin)
DROP PROCEDURE IF EXISTS sp_get_school_admins//
CREATE PROCEDURE sp_get_school_admins()
BEGIN
  SELECT a.id, a.name, a.email, a.phone_number, a.status, a.registration_status, a.school_id, s.name AS school_name, a.created_at
  FROM tbl_school_admin a
  JOIN tbl_schools s ON a.school_id = s.id;
END//

-- SP: Register School Admin (Self Registration)
DROP PROCEDURE IF EXISTS sp_register_school_admin//
CREATE PROCEDURE sp_register_school_admin(
  IN p_school_id INT,
  IN p_name VARCHAR(255),
  IN p_email VARCHAR(255),
  IN p_phone VARCHAR(50),
  IN p_password VARCHAR(255)
)
BEGIN
  DECLARE v_user_id INT;
  
  -- Insert into tbl_users for Authentication
  INSERT INTO tbl_users (username, email, password, role_id, status)
  VALUES (p_email, p_email, p_password, 2, 'Active');
  
  SET v_user_id = LAST_INSERT_ID();

  INSERT INTO tbl_school_admin (user_id, school_id, name, email, phone_number, password, role_id, status, registration_status)
  VALUES (v_user_id, p_school_id, p_name, p_email, p_phone, p_password, 2, 'Active', 'Pending');
  SELECT LAST_INSERT_ID() AS admin_id;
END//

-- SP: Approve School Admin (Super Admin)
DROP PROCEDURE IF EXISTS sp_approve_school_admin//
CREATE PROCEDURE sp_approve_school_admin(
  IN p_admin_id INT,
  IN p_status VARCHAR(50),
  IN p_updated_by INT
)
BEGIN
  UPDATE tbl_school_admin 
  SET registration_status = p_status,
      updated_by = p_updated_by
  WHERE id = p_admin_id;
END//

-- SP: Add Branch (School Admin)
DROP PROCEDURE IF EXISTS sp_add_branch//
CREATE PROCEDURE sp_add_branch(
  IN p_school_id INT,
  IN p_name VARCHAR(255),
  IN p_code VARCHAR(100),
  IN p_address TEXT,
  IN p_contact_person VARCHAR(255),
  IN p_contact_number VARCHAR(50),
  IN p_email VARCHAR(255),
  IN p_principal VARCHAR(255),
  IN p_is_main TINYINT,
  IN p_short_code VARCHAR(50),
  IN p_created_by INT
)
BEGIN
  INSERT INTO tbl_school_branches (school_id, branch_name, branch_code, address, contact_person, contact_number, branch_email, principal_name, is_main_branch, short_branch_code, created_by)
  VALUES (p_school_id, p_name, p_code, p_address, p_contact_person, p_contact_number, p_email, p_principal, p_is_main, p_short_code, p_created_by);
  SELECT LAST_INSERT_ID() AS branch_id;
END//

-- SP: Get Branches (School Admin)
DROP PROCEDURE IF EXISTS sp_get_branches//
CREATE PROCEDURE sp_get_branches(IN p_school_id INT)
BEGIN
  SELECT id, branch_name, branch_code, address, contact_person, contact_number, branch_email, principal_name, is_main_branch, short_branch_code, status
  FROM tbl_school_branches
  WHERE school_id = p_school_id;
END//

-- SP: Add Academic Year (School Admin)
DROP PROCEDURE IF EXISTS sp_add_academic_year//
CREATE PROCEDURE sp_add_academic_year(
  IN p_school_id INT,
  IN p_branch_id INT,
  IN p_name VARCHAR(255),
  IN p_semester VARCHAR(100),
  IN p_start_date DATE,
  IN p_end_date DATE,
  IN p_created_by INT
)
BEGIN
  INSERT INTO tbl_academic_years (school_id, branch_id, academic_year_name, semester, start_date, end_date, created_by)
  VALUES (p_school_id, p_branch_id, p_name, p_semester, p_start_date, p_end_date, p_created_by);
  SELECT LAST_INSERT_ID() AS academic_year_id;
END//

-- SP: Get Academic Years (School Admin)
DROP PROCEDURE IF EXISTS sp_get_academic_years//
CREATE PROCEDURE sp_get_academic_years(IN p_school_id INT)
BEGIN
  SELECT 
    ay.academic_year_id, 
    ay.school_id,
    ay.branch_id, 
    b.branch_name,
    ay.academic_year_name, 
    ay.semester, 
    ay.start_date, 
    ay.end_date, 
    ay.is_current, 
    ay.status,
    ay.created_at
  FROM tbl_academic_years ay
  LEFT JOIN tbl_school_branches b ON ay.branch_id = b.id
  WHERE ay.school_id = p_school_id
  ORDER BY ay.academic_year_id DESC;
END//

-- SP: Add Class (School Admin)
DROP PROCEDURE IF EXISTS sp_add_class//
CREATE PROCEDURE sp_add_class(
  IN p_name VARCHAR(255),
  IN p_order INT,
  IN p_created_by INT
)
BEGIN
  INSERT INTO tbl_classes (class_name, display_order, created_by)
  VALUES (p_name, p_order, p_created_by);
  SELECT LAST_INSERT_ID() AS class_id;
END//

-- SP: Get Classes (School Admin)
DROP PROCEDURE IF EXISTS sp_get_classes//
CREATE PROCEDURE sp_get_classes()
BEGIN
  SELECT class_id, class_name, display_order, status
  FROM tbl_classes
  ORDER BY display_order ASC;
END//

-- SP: Add School Class Association (School Admin)
DROP PROCEDURE IF EXISTS sp_add_school_class//
CREATE PROCEDURE sp_add_school_class(
  IN p_class_id INT,
  IN p_school_id INT,
  IN p_branch_id INT,
  IN p_location VARCHAR(255),
  IN p_capacity INT,
  IN p_created_by INT
)
BEGIN
  INSERT INTO tbl_school_classes (class_id, school_id, branch_id, location, student_capacity, created_by)
  VALUES (p_class_id, p_school_id, p_branch_id, p_location, p_capacity, p_created_by);
  SELECT LAST_INSERT_ID() AS school_class_id;
END//

-- SP: Get School Classes (School Admin)
DROP PROCEDURE IF EXISTS sp_get_school_classes//
CREATE PROCEDURE sp_get_school_classes(IN p_school_id INT, IN p_branch_id INT)
BEGIN
  SELECT 
    sc.school_class_id, 
    sc.class_id, 
    c.class_name, 
    sc.school_id, 
    sc.branch_id, 
    b.branch_name, 
    sc.location, 
    sc.student_capacity, 
    sc.status
  FROM tbl_school_classes sc
  JOIN tbl_classes c ON sc.class_id = c.class_id
  LEFT JOIN tbl_school_branches b ON sc.branch_id = b.id
  WHERE sc.school_id = p_school_id 
    AND (p_branch_id IS NULL OR p_branch_id = 0 OR sc.branch_id = p_branch_id)
  ORDER BY sc.school_class_id DESC;
END//

-- SP: Add Section (School Admin)
DROP PROCEDURE IF EXISTS sp_add_section//
CREATE PROCEDURE sp_add_section(
  IN p_name VARCHAR(255),
  IN p_room VARCHAR(50),
  IN p_created_by INT
)
BEGIN
  INSERT INTO tbl_sections (section_name, room_number, created_by)
  VALUES (p_name, p_room, p_created_by);
  SELECT LAST_INSERT_ID() AS section_id;
END//

-- SP: Get Sections (School Admin)
DROP PROCEDURE IF EXISTS sp_get_sections//
CREATE PROCEDURE sp_get_sections()
BEGIN
  SELECT section_id, section_name, room_number, status
  FROM tbl_sections
  ORDER BY section_id ASC;
END//

-- SP: Add Staff (School Admin & Self Registration)
DROP PROCEDURE IF EXISTS sp_add_staff//
CREATE PROCEDURE sp_add_staff(
  IN p_name VARCHAR(255),
  IN p_email VARCHAR(255),
  IN p_phone VARCHAR(50),
  IN p_school_id INT,
  IN p_branch_id INT,
  IN p_staff_type_id INT,
  IN p_custom_staff_type VARCHAR(255),
  IN p_department_id INT,
  IN p_custom_staff_department VARCHAR(255),
  IN p_password VARCHAR(255),
  IN p_created_by INT
)
BEGIN
  DECLARE v_user_id INT;
  
  -- Insert into tbl_users for Authentication
  INSERT INTO tbl_users (username, email, password, role_id, status)
  VALUES (p_email, p_email, p_password, 3, 'Active');
  
  SET v_user_id = LAST_INSERT_ID();

  -- Insert into tbl_staff Profile
  INSERT INTO tbl_staff (user_id, name, email, phone_number, school_id, branch_id, staff_type_id, custom_staff_type, department_id, custom_staff_department, password, role_id, status, registration_status, created_by)
  VALUES (v_user_id, p_name, p_email, p_phone, p_school_id, p_branch_id, p_staff_type_id, p_custom_staff_type, p_department_id, p_custom_staff_department, p_password, 3, 'Active', 'Approved', p_created_by);
  
  SELECT LAST_INSERT_ID() AS staff_id;
END//

-- SP: Add Login History
DROP PROCEDURE IF EXISTS sp_add_login_history//
CREATE PROCEDURE sp_add_login_history(
  IN p_user_id INT,
  IN p_ip_address VARCHAR(45),
  IN p_user_agent TEXT,
  IN p_status VARCHAR(50),
  IN p_failure_reason VARCHAR(255)
)
BEGIN
  INSERT INTO tbl_login_history (user_id, ip_address, user_agent, status, failure_reason)
  VALUES (p_user_id, p_ip_address, p_user_agent, p_status, p_failure_reason);
END//

-- SP: Get Login History
DROP PROCEDURE IF EXISTS sp_get_login_history//
CREATE PROCEDURE sp_get_login_history(
  IN p_user_id INT
)
BEGIN
  SELECT id, login_time, ip_address, user_agent, status, failure_reason
  FROM tbl_login_history
  WHERE user_id = p_user_id
  ORDER BY login_time DESC
  LIMIT 50;
END//

-- SP: Get Staff (School Admin)
DROP PROCEDURE IF EXISTS sp_get_staff//
CREATE PROCEDURE sp_get_staff(IN p_school_id INT)
BEGIN
  SELECT 
    s.id, 
    s.user_id,
    s.name, 
    s.email, 
    s.phone_number, 
    s.status, 
    s.registration_status, 
    s.school_id,
    s.branch_id,
    b.branch_name,
    s.staff_type_id,
    s.custom_staff_type,
    COALESCE(st.type_name, s.custom_staff_type) AS staff_type,
    s.department_id,
    s.custom_staff_department,
    COALESCE(sd.department_name, s.custom_staff_department) AS department_name,
    s.office_location,
    s.qualification,
    s.joining_date,
    s.experience,
    s.salary,
    s.created_at
  FROM tbl_staff s
  LEFT JOIN tbl_school_branches b ON s.branch_id = b.id
  LEFT JOIN tbl_staff_types st ON s.staff_type_id = st.id
  LEFT JOIN tbl_staff_departments sd ON s.department_id = sd.id
  WHERE s.school_id = p_school_id
  ORDER BY s.id DESC;
END//

-- SP: Add Student (School Admin and Staff)
DROP PROCEDURE IF EXISTS sp_add_student//
CREATE PROCEDURE sp_add_student(
  IN p_school_id INT,
  IN p_student_unique_id VARCHAR(100),
  IN p_admission_number VARCHAR(100),
  IN p_name VARCHAR(255),
  IN p_email VARCHAR(255),
  IN p_phone VARCHAR(50),
  IN p_batch_id INT,
  IN p_created_by INT
)
BEGIN
  INSERT INTO tbl_students (school_id, role_id, student_unique_id, admission_number, name, email, phone_number, batch_id, created_by, status, student_status)
  VALUES (p_school_id, 4, p_student_unique_id, p_admission_number, p_name, p_email, p_phone, p_batch_id, p_created_by, 'Active', 'Active');
  SELECT LAST_INSERT_ID() AS student_id;
END//

-- SP: Get Students (School Admin / Staff)
DROP PROCEDURE IF EXISTS sp_get_students//
CREATE PROCEDURE sp_get_students(IN p_school_id INT)
BEGIN
  SELECT 
    s.student_id, 
    s.user_id,
    s.school_id,
    s.student_unique_id, 
    s.admission_number, 
    s.gr_number,
    s.name, 
    s.email, 
    s.phone_number, 
    s.admission_date,
    s.roll_number,
    s.dob,
    s.gender,
    s.blood_group,
    s.address,
    s.pincode,
    s.emergency_contact_number,
    s.documents,
    s.student_parent_details,
    s.student_status,
    s.is_fee_exempted,
    s.gpa,
    s.status, 
    s.batch_id, 
    b.batch_code,
    c.class_name,
    sec.section_name,
    s.parent_ids,
    s.created_at
  FROM tbl_students s
  LEFT JOIN tbl_batches b ON s.batch_id = b.batch_id
  LEFT JOIN tbl_school_classes sc ON b.school_class_id = sc.school_class_id
  LEFT JOIN tbl_classes c ON sc.class_id = c.class_id
  LEFT JOIN tbl_sections sec ON b.section_id = sec.section_id
  WHERE s.school_id = p_school_id
  ORDER BY s.student_id DESC;
END//

-- SP: Add Batch (School Admin)
DROP PROCEDURE IF EXISTS sp_add_batch//
CREATE PROCEDURE sp_add_batch(
  IN p_code VARCHAR(100),
  IN p_school_class_id INT,
  IN p_academic_year_id INT,
  IN p_section_id INT,
  IN p_teacher_id INT,
  IN p_created_by INT
)
BEGIN
  INSERT INTO tbl_batches (batch_code, school_class_id, academic_year_id, section_id, teacher_id, created_by)
  VALUES (p_code, p_school_class_id, p_academic_year_id, p_section_id, p_teacher_id, p_created_by);
  SELECT LAST_INSERT_ID() AS batch_id;
END//

-- SP: Get Batches (School Admin / Staff)
DROP PROCEDURE IF EXISTS sp_get_batches//
CREATE PROCEDURE sp_get_batches(IN p_school_class_id INT)
BEGIN
  SELECT 
    b.batch_id, 
    b.batch_code, 
    b.school_class_id, 
    b.academic_year_id, 
    b.section_id, 
    b.teacher_id, 
    s.name AS teacher_name, 
    b.school_medium_id,
    b.start_time,
    b.end_time,
    b.duration_minutes,
    b.status,
    c.class_name,
    sec.section_name,
    ay.academic_year_name
  FROM tbl_batches b
  LEFT JOIN tbl_school_classes sc ON b.school_class_id = sc.school_class_id
  LEFT JOIN tbl_classes c ON sc.class_id = c.class_id
  LEFT JOIN tbl_sections sec ON b.section_id = sec.section_id
  LEFT JOIN tbl_academic_years ay ON b.academic_year_id = ay.academic_year_id
  LEFT JOIN tbl_staff s ON b.teacher_id = s.id
  WHERE (p_school_class_id IS NULL OR p_school_class_id = 0 OR b.school_class_id = p_school_class_id)
  ORDER BY b.batch_id DESC;
END//

-- SP: Get Staff Batches (Staff)
DROP PROCEDURE IF EXISTS sp_get_staff_batches//
CREATE PROCEDURE sp_get_staff_batches(IN p_teacher_id INT)
BEGIN
  SELECT b.batch_id, b.batch_code, c.class_name, sec.section_name, b.status
  FROM tbl_batches b
  JOIN tbl_school_classes sc ON b.school_class_id = sc.school_class_id
  JOIN tbl_classes c ON sc.class_id = c.class_id
  JOIN tbl_sections sec ON b.section_id = sec.section_id
  WHERE b.teacher_id = p_teacher_id;
END//

-- SP: Get Student Profile (Student / Parent)
DROP PROCEDURE IF EXISTS sp_get_student_profile//
CREATE PROCEDURE sp_get_student_profile(IN p_student_id INT)
BEGIN
  SELECT 
    s.student_id, 
    s.user_id,
    s.name, 
    s.email, 
    s.phone_number, 
    s.student_unique_id, 
    s.admission_number, 
    s.gr_number,
    s.roll_number,
    s.dob,
    s.gender,
    s.blood_group,
    s.address,
    s.pincode,
    s.emergency_contact_number,
    s.documents,
    s.student_parent_details,
    s.student_status,
    s.is_fee_exempted,
    s.gpa, 
    s.status, 
    s.school_id, 
    sch.name AS school_name, 
    sch.school_code AS school_code,
    s.batch_id, 
    b.batch_code,
    c.class_name,
    sec.section_name,
    s.parent_ids
  FROM tbl_students s
  LEFT JOIN tbl_schools sch ON s.school_id = sch.id
  LEFT JOIN tbl_batches b ON s.batch_id = b.batch_id
  LEFT JOIN tbl_school_classes sc ON b.school_class_id = sc.school_class_id
  LEFT JOIN tbl_classes c ON sc.class_id = c.class_id
  LEFT JOIN tbl_sections sec ON b.section_id = sec.section_id
  WHERE s.student_id = p_student_id;
END//

-- SP: Get Staff Types
DROP PROCEDURE IF EXISTS sp_get_staff_types//
CREATE PROCEDURE sp_get_staff_types()
BEGIN
  SELECT id, type_name, description FROM tbl_staff_types WHERE status = 'Active';
END//

-- SP: Get Staff Departments
DROP PROCEDURE IF EXISTS sp_get_staff_departments//
CREATE PROCEDURE sp_get_staff_departments()
BEGIN
  SELECT id, department_name, description FROM tbl_staff_departments WHERE status = 'Active';
END//

-- SP: Add Student Self Registration
DROP PROCEDURE IF EXISTS sp_add_student_self//
CREATE PROCEDURE sp_add_student_self(
  IN p_name VARCHAR(255),
  IN p_email VARCHAR(255),
  IN p_phone VARCHAR(50),
  IN p_school_id INT,
  IN p_branch_id INT,
  IN p_student_unique_id VARCHAR(100),
  IN p_admission_number VARCHAR(100),
  IN p_password VARCHAR(255)
)
BEGIN
  DECLARE v_user_id INT;
  
  -- Insert into tbl_users for Authentication (Role 4 = Student)
  INSERT INTO tbl_users (username, email, password, role_id, status)
  VALUES (p_email, p_email, p_password, 4, 'Active');
  
  SET v_user_id = LAST_INSERT_ID();

  -- Insert into tbl_students Profile
  INSERT INTO tbl_students (user_id, school_id, role_id, student_unique_id, admission_number, name, email, password, phone_number, status, student_status)
  VALUES (v_user_id, p_school_id, 4, p_student_unique_id, p_admission_number, p_name, p_email, p_password, p_phone, 'Active', 'Active');

  SELECT LAST_INSERT_ID() AS student_id;
END//

-- SP: Add Parent Self Registration
DROP PROCEDURE IF EXISTS sp_add_parent_self//
CREATE PROCEDURE sp_add_parent_self(
  IN p_name VARCHAR(255),
  IN p_email VARCHAR(255),
  IN p_phone VARCHAR(50),
  IN p_school_id INT,
  IN p_branch_id INT,
  IN p_password VARCHAR(255)
)
BEGIN
  DECLARE v_user_id INT;
  
  -- Insert into tbl_users for Authentication (Role 5 = Parent)
  INSERT INTO tbl_users (username, email, password, role_id, status)
  VALUES (p_email, p_email, p_password, 5, 'Active');
  
  SET v_user_id = LAST_INSERT_ID();

  -- Insert into tbl_parent Profile
  INSERT INTO tbl_parent (user_id, role_id, school_id, branch_id, name, email, phone, password, status)
  VALUES (v_user_id, 5, p_school_id, p_branch_id, p_name, p_email, p_phone, p_password, 'Active');
  
  SELECT LAST_INSERT_ID() AS parent_id;
END//

-- SP: Get Student Profile by User ID
DROP PROCEDURE IF EXISTS sp_get_student_profile_by_userid//
CREATE PROCEDURE sp_get_student_profile_by_userid(IN p_user_id INT)
BEGIN
  SELECT 
    s.student_id AS id, 
    s.user_id,
    s.name, 
    s.email, 
    s.phone_number, 
    s.student_unique_id, 
    s.admission_number, 
    s.gr_number,
    s.roll_number,
    s.dob,
    s.gender,
    s.blood_group,
    s.address,
    s.pincode,
    s.emergency_contact_number,
    s.documents,
    s.student_parent_details,
    s.student_status,
    s.is_fee_exempted,
    s.gpa, 
    s.status, 
    s.school_id, 
    sch.name AS school_name, 
    sch.school_code AS school_code, 
    s.batch_id, 
    b.batch_code,
    c.class_name,
    sec.section_name,
    s.parent_ids
  FROM tbl_students s
  LEFT JOIN tbl_schools sch ON s.school_id = sch.id
  LEFT JOIN tbl_batches b ON s.batch_id = b.batch_id
  LEFT JOIN tbl_school_classes sc ON b.school_class_id = sc.school_class_id
  LEFT JOIN tbl_classes c ON sc.class_id = c.class_id
  LEFT JOIN tbl_sections sec ON b.section_id = sec.section_id
  WHERE s.user_id = p_user_id;
END//

-- SP: Get Parent Profile by User ID
DROP PROCEDURE IF EXISTS sp_get_parent_profile_by_userid//
CREATE PROCEDURE sp_get_parent_profile_by_userid(IN p_user_id INT)
BEGIN
  SELECT 
    p.parent_id AS id, 
    p.user_id,
    p.name, 
    p.email, 
    p.phone AS phone_number, 
    p.parent_details,
    p.telegram_chat_id,
    p.status, 
    p.school_id, 
    sch.name AS school_name, 
    sch.school_code AS school_code, 
    p.branch_id,
    b.branch_name
  FROM tbl_parent p
  LEFT JOIN tbl_schools sch ON p.school_id = sch.id
  LEFT JOIN tbl_school_branches b ON p.branch_id = b.id
  WHERE p.user_id = p_user_id;
END//

-- SP: Get User by Email
DROP PROCEDURE IF EXISTS sp_get_user_by_email//
CREATE PROCEDURE sp_get_user_by_email(IN p_email VARCHAR(255))
BEGIN
  SELECT id, username, email, password, role_id, status
  FROM tbl_users
  WHERE email = p_email AND status = 'Active';
END//

DELIMITER ;
