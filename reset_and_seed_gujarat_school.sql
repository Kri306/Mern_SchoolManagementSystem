-- ====================================================================
-- SQL Script: reset_and_seed_gujarat_school.sql
-- Description: Clears existing school admins, staff, students, and parents,
--              and seeds a new popular school (Gujarat Public School)
--              with 3 branches, 6 staff per branch, and Gujarat students.
-- Plaintext Password for all accounts: admin123
-- Database: sms_db (MySQL)
-- ====================================================================

USE sms_db;

-- --------------------------------------------------------------------
-- STEP 1: DISABLE FOREIGN KEY CHECKS & CLEAR EXISTING DATA
-- --------------------------------------------------------------------
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE tbl_login_history;
TRUNCATE TABLE tbl_students;
TRUNCATE TABLE tbl_parent;
TRUNCATE TABLE tbl_batches;
TRUNCATE TABLE tbl_staff;
TRUNCATE TABLE tbl_school_admin;
TRUNCATE TABLE tbl_school_branches;
TRUNCATE TABLE tbl_schools;
TRUNCATE TABLE tbl_academic_year_sessions;
TRUNCATE TABLE tbl_academic_years;
TRUNCATE TABLE tbl_school_classes;
TRUNCATE TABLE tbl_school_mediums;
TRUNCATE TABLE tbl_school_boards;
TRUNCATE TABLE tbl_users;

SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------------------
-- STEP 2: SEED ROLES
-- --------------------------------------------------------------------
INSERT INTO tbl_roles (role_id, role_name, status) VALUES 
(1, 'Super Admin', 'Active'),
(2, 'School Admin', 'Active'),
(3, 'Staff', 'Active'),
(4, 'Student', 'Active'),
(5, 'Parent', 'Active')
ON DUPLICATE KEY UPDATE role_name=VALUES(role_name);

-- --------------------------------------------------------------------
-- STEP 3: SEED STAFF TYPES & DEPARTMENTS
-- --------------------------------------------------------------------
INSERT INTO tbl_staff_types (id, type_name, description, status) VALUES
(1, 'Teaching Staff', 'All teachers and educators', 'Active'),
(2, 'Administrative Staff', 'Accountants, registrars, and office clerks', 'Active'),
(3, 'Support Staff', 'Maintenance, transportation, and auxiliary personnel', 'Active'),
(4, 'Technical Staff', 'IT administrators, technicians, and lab assistants', 'Active'),
(5, 'Management Staff', 'Principal, vice principal, and coordinators', 'Active'),
(6, 'Medical Staff', 'School doctors, nurses, and medical officers', 'Active'),
(7, 'Security Staff', 'Gatekeepers, campus security officers, and guards', 'Active'),
(8, 'Counseling & Welfare', 'School counselors, social workers, and advisors', 'Active')
ON DUPLICATE KEY UPDATE type_name=VALUES(type_name), description=VALUES(description), status=VALUES(status);

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
ON DUPLICATE KEY UPDATE department_name=VALUES(department_name), description=VALUES(description), status=VALUES(status);

-- --------------------------------------------------------------------
-- STEP 4: SEED DEFAULT CLASSES & SECTIONS
-- --------------------------------------------------------------------
INSERT INTO tbl_classes (class_id, class_name, display_order, status) VALUES
(9, 'Class 9', 9, 'Active'),
(10, 'Class 10', 10, 'Active')
ON DUPLICATE KEY UPDATE class_name=VALUES(class_name), display_order=VALUES(display_order);

INSERT INTO tbl_sections (section_id, section_name, room_number, status) VALUES
(1, 'Section A', 'R-101', 'Active'),
(2, 'Section B', 'R-102', 'Active')
ON DUPLICATE KEY UPDATE section_name=VALUES(section_name), room_number=VALUES(room_number);

-- --------------------------------------------------------------------
-- STEP 5: SEED NEW SCHOOL (Gujarat Public School)
-- --------------------------------------------------------------------
INSERT INTO tbl_schools (id, name, school_code, address, contact_number, email_id, logo, website_link, working_hours, status, bank_details, telegram_channel_id, created_by) VALUES
(1, 'Gujarat Public School', 'GPS001', 'Near Atladara, Kalali Road, Vadodara, Gujarat', '0265-2345678', 'contact@gpsgujarat.ac.in', 'gps_logo.png', 'https://www.gpsgujarat.ac.in', '08:00 AM - 02:00 PM', 'Active', 'Bank: SBI, A/C: 12345678901, IFSC: SBIN0001234', NULL, 1);

-- --------------------------------------------------------------------
-- STEP 6: SEED SCHOOL ADMIN
-- --------------------------------------------------------------------
-- Credentials: admin@gpsgujarat.ac.in / admin123
INSERT INTO tbl_users (id, username, email, password, role_id, status) VALUES
(10, 'admin@gpsgujarat.ac.in', 'admin@gpsgujarat.ac.in', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 2, 'Active');

INSERT INTO tbl_school_admin (id, user_id, school_id, name, email, phone_number, password, role_id, status, registration_status, created_by) VALUES
(1, 10, 1, 'Nitin Patel', 'admin@gpsgujarat.ac.in', '9898012345', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 2, 'Active', 'Approved', 1);

-- --------------------------------------------------------------------
-- STEP 7: SEED 3 SCHOOL BRANCHES
-- --------------------------------------------------------------------
INSERT INTO tbl_school_branches (id, school_id, branch_name, branch_code, address, contact_person, contact_number, branch_email, principal_name, is_main_branch, status, short_branch_code) VALUES
(1, 1, 'Vadodara Main Branch', 'GPS001-B1', 'Near Atladara, Kalali Road, Vadodara, Gujarat - 390012', 'Dr. Rajesh Patel', '9876500001', 'vadodara@gpsgujarat.ac.in', 'Dr. Rajesh Patel', 1, 'Active', 'VAD'),
(2, 1, 'Ahmedabad SG Highway Branch', 'GPS001-B2', 'Off S.G. Highway, Near Vaishnodevi Circle, Ahmedabad, Gujarat - 382421', 'Mrs. Smita Shah', '9876500002', 'ahmedabad@gpsgujarat.ac.in', 'Mrs. Smita Shah', 0, 'Active', 'AMD'),
(3, 1, 'Surat Piplod Branch', 'GPS001-B3', 'Dumas Road, Near Piplod, Surat, Gujarat - 395007', 'Mr. Hitesh Mehta', '9876500003', 'surat@gpsgujarat.ac.in', 'Mr. Hitesh Mehta', 0, 'Active', 'SUR');

-- --------------------------------------------------------------------
-- STEP 8: SEED ACADEMIC YEARS & SESSIONS
-- --------------------------------------------------------------------
INSERT INTO tbl_academic_years (academic_year_id, school_id, branch_id, academic_year_name, semester, start_date, end_date, is_current, status) VALUES
(1, 1, 1, '2026-27', 'First Semester', '2026-06-01', '2027-05-31', 1, 'Active'),
(2, 1, 2, '2026-27', 'First Semester', '2026-06-01', '2027-05-31', 1, 'Active'),
(3, 1, 3, '2026-27', 'First Semester', '2026-06-01', '2027-05-31', 1, 'Active');

INSERT INTO tbl_academic_year_sessions (session_id, academic_year_id, session_name, session_number, start_date, end_date, is_current, status) VALUES
(1, 1, 'Term 1', 'S-01', '2026-06-01', '2026-11-30', 1, 'Active'),
(2, 2, 'Term 1', 'S-01', '2026-06-01', '2026-11-30', 1, 'Active'),
(3, 3, 'Term 1', 'S-01', '2026-06-01', '2026-11-30', 1, 'Active');

-- --------------------------------------------------------------------
-- STEP 9: SEED MEDIUMS
-- --------------------------------------------------------------------
INSERT INTO tbl_master_mediums (master_medium_id, medium_name, approval_status, status) VALUES
(1, 'English', 'Approved', 'Active'),
(2, 'Gujarati', 'Approved', 'Active')
ON DUPLICATE KEY UPDATE medium_name=VALUES(medium_name);

INSERT INTO tbl_school_mediums (school_medium_id, school_id, master_medium_id, custom_medium_name, approval_status, status) VALUES
(1, 1, 1, 'English Medium', 'Approved', 'Active'),
(2, 1, 2, 'Gujarati Medium', 'Approved', 'Active');

-- --------------------------------------------------------------------
-- STEP 10: SEED SCHOOL CLASS MAPS
-- --------------------------------------------------------------------
-- Vadodara Branch (branch_id = 1)
INSERT INTO tbl_school_classes (school_class_id, class_id, school_id, branch_id, location, student_capacity, status) VALUES
(1, 9, 1, 1, 'Building A, Room 101', 40, 'Active'),
(2, 10, 1, 1, 'Building A, Room 102', 40, 'Active'),
-- Ahmedabad Branch (branch_id = 2)
(3, 9, 1, 2, 'Block B, Room 201', 45, 'Active'),
(4, 10, 1, 2, 'Block B, Room 202', 45, 'Active'),
-- Surat Branch (branch_id = 3)
(5, 9, 1, 3, 'Main Wing, Room 301', 35, 'Active'),
(6, 10, 1, 3, 'Main Wing, Room 302', 35, 'Active');

-- --------------------------------------------------------------------
-- STEP 11: SEED STAFF MEMBERS (6 staff members per branch = 18 staff)
-- Plaintext Password: admin123
-- --------------------------------------------------------------------

-- Branch 1: Vadodara Staff Users (IDs: 20 - 25)
INSERT INTO tbl_users (id, username, email, password, role_id, status) VALUES
(20, 'rajesh.patel@gpsgujarat.ac.in', 'rajesh.patel@gpsgujarat.ac.in', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 3, 'Active'),
(21, 'kirit.pandya@gpsgujarat.ac.in', 'kirit.pandya@gpsgujarat.ac.in', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 3, 'Active'),
(22, 'anjali.joshi@gpsgujarat.ac.in', 'anjali.joshi@gpsgujarat.ac.in', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 3, 'Active'),
(23, 'meena.trivedi@gpsgujarat.ac.in', 'meena.trivedi@gpsgujarat.ac.in', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 3, 'Active'),
(24, 'jayesh.vyas@gpsgujarat.ac.in', 'jayesh.vyas@gpsgujarat.ac.in', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 3, 'Active'),
(25, 'vikram.rathod@gpsgujarat.ac.in', 'vikram.rathod@gpsgujarat.ac.in', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 3, 'Active');

-- Branch 1: Vadodara Staff Profiles (IDs: 10 - 15)
INSERT INTO tbl_staff (id, user_id, name, email, phone_number, school_id, branch_id, staff_type_id, department_id, office_location, qualification, joining_date, experience, salary, role_id, registration_status, password, status) VALUES
(10, 20, 'Dr. Rajesh Patel', 'rajesh.patel@gpsgujarat.ac.in', '9876510001', 1, 1, 5, 1, 'Principal Office', 'Ph.D in Education', '2015-06-01', '15 Years', 95000.00, 3, 'Approved', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 'Active'),
(11, 21, 'Kirit Pandya', 'kirit.pandya@gpsgujarat.ac.in', '9876510002', 1, 1, 1, 2, 'Staff Room A', 'M.Sc. Mathematics, B.Ed', '2018-08-15', '8 Years', 55000.00, 3, 'Approved', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 'Active'),
(12, 22, 'Anjali Joshi', 'anjali.joshi@gpsgujarat.ac.in', '9876510003', 1, 1, 1, 1, 'Staff Room B', 'M.Sc. Chemistry, B.Ed', '2019-06-10', '6 Years', 52000.00, 3, 'Approved', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 'Active'),
(13, 23, 'Meena Trivedi', 'meena.trivedi@gpsgujarat.ac.in', '9876510004', 1, 1, 1, 3, 'Staff Room A', 'M.A. English, B.Ed', '2017-06-01', '9 Years', 50000.00, 3, 'Approved', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 'Active'),
(14, 24, 'Jayesh Vyas', 'jayesh.vyas@gpsgujarat.ac.in', '9876510005', 1, 1, 2, 5, 'Admin Office', 'M.Com, MBA', '2016-04-10', '10 Years', 48000.00, 3, 'Approved', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 'Active'),
(15, 25, 'Vikram Rathod', 'vikram.rathod@gpsgujarat.ac.in', '9876510006', 1, 1, 4, 6, 'Server Room', 'B.E. Information Technology', '2020-01-15', '5 Years', 45000.00, 3, 'Approved', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 'Active');


-- Branch 2: Ahmedabad Staff Users (IDs: 30 - 35)
INSERT INTO tbl_users (id, username, email, password, role_id, status) VALUES
(30, 'smita.shah@gpsgujarat.ac.in', 'smita.shah@gpsgujarat.ac.in', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 3, 'Active'),
(31, 'karan.dave@gpsgujarat.ac.in', 'karan.dave@gpsgujarat.ac.in', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 3, 'Active'),
(32, 'nehal.parmar@gpsgujarat.ac.in', 'nehal.parmar@gpsgujarat.ac.in', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 3, 'Active'),
(33, 'gita.bhatt@gpsgujarat.ac.in', 'gita.bhatt@gpsgujarat.ac.in', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 3, 'Active'),
(34, 'suresh.solanki@gpsgujarat.ac.in', 'suresh.solanki@gpsgujarat.ac.in', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 3, 'Active'),
(35, 'alkesh.patel@gpsgujarat.ac.in', 'alkesh.patel@gpsgujarat.ac.in', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 3, 'Active');

-- Branch 2: Ahmedabad Staff Profiles (IDs: 16 - 21)
INSERT INTO tbl_staff (id, user_id, name, email, phone_number, school_id, branch_id, staff_type_id, department_id, office_location, qualification, joining_date, experience, salary, role_id, registration_status, password, status) VALUES
(16, 30, 'Mrs. Smita Shah', 'smita.shah@gpsgujarat.ac.in', '9876520001', 1, 2, 5, 3, 'Principal Office', 'M.A. English, M.Ed', '2016-06-01', '12 Years', 90000.00, 3, 'Approved', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 'Active'),
(17, 31, 'Karan Dave', 'karan.dave@gpsgujarat.ac.in', '9876520002', 1, 2, 1, 2, 'Staff Room X', 'M.Sc. Mathematics, B.Ed', '2020-06-15', '6 Years', 50000.00, 3, 'Approved', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 'Active'),
(18, 32, 'Nehal Parmar', 'nehal.parmar@gpsgujarat.ac.in', '9876520003', 1, 2, 1, 1, 'Staff Room Y', 'M.Sc. Physics, B.Ed', '2019-11-01', '7 Years', 53000.00, 3, 'Approved', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 'Active'),
(19, 33, 'Gita Bhatt', 'gita.bhatt@gpsgujarat.ac.in', '9876520004', 1, 2, 1, 3, 'Staff Room X', 'M.A. Hindi, B.Ed', '2018-06-01', '8 Years', 48000.00, 3, 'Approved', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 'Active'),
(20, 34, 'Suresh Solanki', 'suresh.solanki@gpsgujarat.ac.in', '9876520005', 1, 2, 2, 5, 'Admin Wing', 'B.Com, M.Com', '2017-02-15', '9 Years', 46000.00, 3, 'Approved', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 'Active'),
(21, 35, 'Alkesh Patel', 'alkesh.patel@gpsgujarat.ac.in', '9876520006', 1, 2, 4, 6, 'IT Lab', 'B.Sc. Computer Science', '2021-08-01', '4 years', 43000.00, 3, 'Approved', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 'Active');


-- Branch 3: Surat Staff Users (IDs: 40 - 45)
INSERT INTO tbl_users (id, username, email, password, role_id, status) VALUES
(40, 'hitesh.mehta@gpsgujarat.ac.in', 'hitesh.mehta@gpsgujarat.ac.in', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 3, 'Active'),
(41, 'pranav.desai@gpsgujarat.ac.in', 'pranav.desai@gpsgujarat.ac.in', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 3, 'Active'),
(42, 'rupa.sanghavi@gpsgujarat.ac.in', 'rupa.sanghavi@gpsgujarat.ac.in', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 3, 'Active'),
(43, 'bipin.vaghela@gpsgujarat.ac.in', 'bipin.vaghela@gpsgujarat.ac.in', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 3, 'Active'),
(44, 'nisha.naik@gpsgujarat.ac.in', 'nisha.naik@gpsgujarat.ac.in', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 3, 'Active'),
(45, 'dhaval.choksi@gpsgujarat.ac.in', 'dhaval.choksi@gpsgujarat.ac.in', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 3, 'Active');

-- Branch 3: Surat Staff Profiles (IDs: 22 - 27)
INSERT INTO tbl_staff (id, user_id, name, email, phone_number, school_id, branch_id, staff_type_id, department_id, office_location, qualification, joining_date, experience, salary, role_id, registration_status, password, status) VALUES
(22, 40, 'Mr. Hitesh Mehta', 'hitesh.mehta@gpsgujarat.ac.in', '9876530001', 1, 3, 5, 2, 'Principal Office', 'M.Sc, M.Ed', '2015-06-01', '14 Years', 92000.00, 3, 'Approved', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 'Active'),
(23, 41, 'Pranav Desai', 'pranav.desai@gpsgujarat.ac.in', '9876530002', 1, 3, 1, 1, 'Staff Room 1', 'M.Sc. Biology, B.Ed', '2020-07-01', '5 Years', 48000.00, 3, 'Approved', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 'Active'),
(24, 42, 'Rupa Sanghavi', 'rupa.sanghavi@gpsgujarat.ac.in', '9876530003', 1, 3, 1, 2, 'Staff Room 2', 'M.Sc. Mathematics, B.Ed', '2018-06-15', '8 Years', 54000.00, 3, 'Approved', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 'Active'),
(25, 43, 'Bipin Vaghela', 'bipin.vaghela@gpsgujarat.ac.in', '9876530004', 1, 3, 1, 3, 'Staff Room 1', 'M.A. Gujarati, B.Ed', '2016-06-01', '10 Years', 50000.00, 3, 'Approved', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 'Active'),
(26, 44, 'Nisha Naik', 'nisha.naik@gpsgujarat.ac.in', '9876530005', 1, 3, 2, 5, 'Admissions Office', 'MBA in HR', '2019-03-01', '7 Years', 47000.00, 3, 'Approved', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 'Active'),
(27, 45, 'Dhaval Choksi', 'dhaval.choksi@gpsgujarat.ac.in', '9876530006', 1, 3, 4, 6, 'IT Helpdesk', 'B.C.A.', '2022-01-10', '3 Years', 41000.00, 3, 'Approved', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 'Active');


-- --------------------------------------------------------------------
-- STEP 12: SEED BATCHES
-- --------------------------------------------------------------------
INSERT INTO tbl_batches (batch_id, batch_code, school_class_id, academic_year_id, section_id, teacher_id, school_medium_id, start_time, end_time, duration_minutes, status, created_by) VALUES
-- Vadodara Branch Batches (Teacher Kirit Pandya [ID 11] and Anjali Joshi [ID 12])
(1, 'GPS-VAD-9A', 1, 1, 1, 11, 1, '08:30:00', '13:30:00', 300, 'Active', 10),
(2, 'GPS-VAD-10A', 2, 1, 1, 12, 1, '08:30:00', '13:30:00', 300, 'Active', 10),
-- Ahmedabad Branch Batches (Teacher Karan Dave [ID 17] and Nehal Parmar [ID 18])
(3, 'GPS-AMD-9A', 3, 2, 1, 17, 1, '08:30:00', '13:30:00', 300, 'Active', 10),
(4, 'GPS-AMD-10A', 4, 2, 1, 18, 1, '08:30:00', '13:30:00', 300, 'Active', 10),
-- Surat Branch Batches (Teacher Rupa Sanghavi [ID 24] and Pranav Desai [ID 23])
(5, 'GPS-SUR-9A', 5, 3, 1, 24, 1, '08:30:00', '13:30:00', 300, 'Active', 10),
(6, 'GPS-SUR-10A', 6, 3, 1, 23, 1, '08:30:00', '13:30:00', 300, 'Active', 10);

-- --------------------------------------------------------------------
-- STEP 13: SEED PARENTS (9 parents)
-- Plaintext Password: admin123
-- --------------------------------------------------------------------

-- Parent Users (IDs: 50 - 58)
INSERT INTO tbl_users (id, username, email, password, role_id, status) VALUES
(50, 'mahendra.patel@gmail.com', 'mahendra.patel@gmail.com', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 5, 'Active'),
(51, 'amit.shah.vad@gmail.com', 'amit.shah.vad@gmail.com', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 5, 'Active'),
(52, 'raman.joshi@gmail.com', 'raman.joshi@gmail.com', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 5, 'Active'),
(53, 'pankaj.shah@gmail.com', 'pankaj.shah@gmail.com', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 5, 'Active'),
(54, 'shailesh.patel.amd@gmail.com', 'shailesh.patel.amd@gmail.com', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 5, 'Active'),
(55, 'suryakant.mehta@gmail.com', 'suryakant.mehta@gmail.com', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 5, 'Active'),
(56, 'jagdish.desai@gmail.com', 'jagdish.desai@gmail.com', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 5, 'Active'),
(57, 'paresh.choksi@gmail.com', 'paresh.choksi@gmail.com', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 5, 'Active'),
(58, 'girish.vaghela@gmail.com', 'girish.vaghela@gmail.com', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 5, 'Active');

-- Parent Profiles (IDs: 1 - 9)
INSERT INTO tbl_parent (parent_id, user_id, role_id, school_id, branch_id, name, email, phone, password, status) VALUES
-- Vadodara Parents
(1, 50, 5, 1, 1, 'Mahendra Patel', 'mahendra.patel@gmail.com', '9898011223', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 'Active'),
(2, 51, 5, 1, 1, 'Amit Shah', 'amit.shah.vad@gmail.com', '9898011224', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 'Active'),
(3, 52, 5, 1, 1, 'Ramanlal Joshi', 'raman.joshi@gmail.com', '9898011225', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 'Active'),
-- Ahmedabad Parents
(4, 53, 5, 1, 2, 'Pankaj Shah', 'pankaj.shah@gmail.com', '9898022334', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 'Active'),
(5, 54, 5, 1, 2, 'Shailesh Patel', 'shailesh.patel.amd@gmail.com', '9898022335', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 'Active'),
(6, 55, 5, 1, 2, 'Suryakant Mehta', 'suryakant.mehta@gmail.com', '9898022336', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 'Active'),
-- Surat Parents
(7, 56, 5, 1, 3, 'Jagdish Desai', 'jagdish.desai@gmail.com', '9898033445', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 'Active'),
(8, 57, 5, 1, 3, 'Paresh Choksi', 'paresh.choksi@gmail.com', '9898033446', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 'Active'),
(9, 58, 5, 1, 3, 'Girish Vaghela', 'girish.vaghela@gmail.com', '9898033447', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 'Active');

-- --------------------------------------------------------------------
-- STEP 14: SEED STUDENTS (9 students with Gujarat addresses & details)
-- Plaintext Password: admin123
-- --------------------------------------------------------------------

-- Student Users (IDs: 60 - 68)
INSERT INTO tbl_users (id, username, email, password, role_id, status) VALUES
(60, 'aarav.patel@gpsgujarat.ac.in', 'aarav.patel@gpsgujarat.ac.in', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 4, 'Active'),
(61, 'diya.shah@gpsgujarat.ac.in', 'diya.shah@gpsgujarat.ac.in', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 4, 'Active'),
(62, 'kavya.joshi@gpsgujarat.ac.in', 'kavya.joshi@gpsgujarat.ac.in', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 4, 'Active'),
(63, 'devan.shah@gpsgujarat.ac.in', 'devan.shah@gpsgujarat.ac.in', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 4, 'Active'),
(64, 'khushi.patel@gpsgujarat.ac.in', 'khushi.patel@gpsgujarat.ac.in', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 4, 'Active'),
(65, 'mitul.mehta@gpsgujarat.ac.in', 'mitul.mehta@gpsgujarat.ac.in', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 4, 'Active'),
(66, 'aryan.desai@gpsgujarat.ac.in', 'aryan.desai@gpsgujarat.ac.in', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 4, 'Active'),
(67, 'priya.choksi@gpsgujarat.ac.in', 'priya.choksi@gpsgujarat.ac.in', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 4, 'Active'),
(68, 'nihal.vaghela@gpsgujarat.ac.in', 'nihal.vaghela@gpsgujarat.ac.in', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', 4, 'Active');

-- Student Profiles (IDs: 1 - 9)
INSERT INTO tbl_students (student_id, user_id, school_id, role_id, student_unique_id, admission_number, gr_number, name, email, password, phone_number, admission_date, roll_number, dob, gender, blood_group, address, pincode, emergency_contact_number, student_status, is_fee_exempted, gpa, status, created_by, batch_id, parent_ids) VALUES
-- Vadodara Branch Students (Branch ID: 1)
(1, 60, 1, 4, 'GPS-2026-VAD01', 'ADM-VAD-1001', 'GR-10001', 'Aarav Patel', 'aarav.patel@gpsgujarat.ac.in', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', '9898011001', '2026-06-01', '01', '2011-04-12', 'Male', 'O+', '101, Shanti Nagar, Vasna Road, Vadodara, Gujarat', '390007', '9898011223', 'Active', 0, 9.20, 'Active', 10, 1, '1'),
(2, 61, 1, 4, 'GPS-2026-VAD02', 'ADM-VAD-1002', 'GR-10002', 'Diya Shah', 'diya.shah@gpsgujarat.ac.in', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', '9898011002', '2026-06-01', '02', '2010-09-24', 'Female', 'A+', 'B/4, Gokul Row House, Gotri, Vadodara, Gujarat', '390021', '9898011224', 'Active', 0, 9.50, 'Active', 10, 2, '2'),
(3, 62, 1, 4, 'GPS-2026-VAD03', 'ADM-VAD-1003', 'GR-10003', 'Kavya Joshi', 'kavya.joshi@gpsgujarat.ac.in', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', '9898011003', '2026-06-01', '03', '2011-02-18', 'Female', 'B+', '12, Shrinathji Society, Karelibaug, Vadodara, Gujarat', '390018', '9898011225', 'Active', 0, 8.80, 'Active', 10, 1, '3'),

-- Ahmedabad SG Highway Branch Students (Branch ID: 2)
(4, 63, 1, 4, 'GPS-2026-AMD01', 'ADM-AMD-2001', 'GR-20001', 'Devan Shah', 'devan.shah@gpsgujarat.ac.in', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', '9898022001', '2026-06-01', '01', '2011-05-15', 'Male', 'O-', '502, Orchid Heights, Prahladnagar, Ahmedabad, Gujarat', '380015', '9898022334', 'Active', 0, 9.00, 'Active', 10, 3, '4'),
(5, 64, 1, 4, 'GPS-2026-AMD02', 'ADM-AMD-2002', 'GR-20002', 'Khushi Patel', 'khushi.patel@gpsgujarat.ac.in', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', '9898022002', '2026-06-01', '02', '2010-07-11', 'Female', 'AB+', 'Flat 401, Maruti Enclave, Bopal, Ahmedabad, Gujarat', '380058', '9898022335', 'Active', 0, 9.30, 'Active', 10, 4, '5'),
(6, 65, 1, 4, 'GPS-2026-AMD03', 'ADM-AMD-2003', 'GR-20003', 'Mitul Mehta', 'mitul.mehta@gpsgujarat.ac.in', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', '9898022003', '2026-06-01', '03', '2011-12-05', 'Male', 'B-', '7, Kalyan Society, Naranpura, Ahmedabad, Gujarat', '380013', '9898022336', 'Active', 0, 8.50, 'Active', 10, 3, '6'),

-- Surat Piplod Branch Students (Branch ID: 3)
(7, 66, 1, 4, 'GPS-2026-SUR01', 'ADM-SUR-3001', 'GR-30001', 'Aryan Desai', 'aryan.desai@gpsgujarat.ac.in', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', '9898033001', '2026-06-01', '01', '2011-03-30', 'Male', 'A-', 'A-45, Vaikunth Dham, Adajan, Surat, Gujarat', '395009', '9898033445', 'Active', 0, 9.10, 'Active', 10, 5, '7'),
(8, 67, 1, 4, 'GPS-2026-SUR02', 'ADM-SUR-3002', 'GR-30002', 'Priya Choksi', 'priya.choksi@gpsgujarat.ac.in', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', '9898033002', '2026-06-01', '02', '2010-10-19', 'Female', 'O+', 'Block C, Silver Palace, City Light, Surat, Gujarat', '395007', '9898033446', 'Active', 0, 9.40, 'Active', 10, 6, '8'),
(9, 68, 1, 4, 'GPS-2026-SUR03', 'ADM-SUR-3003', 'GR-30003', 'Nihal Vaghela', 'nihal.vaghela@gpsgujarat.ac.in', '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6', '9898033003', '2026-06-01', '03', '2011-08-14', 'Male', 'AB-', '18, Rajhans Society, Katargam, Surat, Gujarat', '395004', '9898033447', 'Active', 0, 8.90, 'Active', 10, 5, '9');

-- --------------------------------------------------------------------
-- STEP 15: COMPLETION
-- --------------------------------------------------------------------
COMMIT;
