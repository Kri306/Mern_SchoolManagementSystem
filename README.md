# Mern_SchoolManagementSystem

[![Repository: Mern_SchoolManagementSystem](https://img.shields.io/badge/Repository-Mern__SchoolManagementSystem-blue.svg)](https://github.com/Kri306/Mern_SchoolManagementSystem)
[![Stack: MERN](https://img.shields.io/badge/Stack-React%20%7C%20Node%20%7C%20Express%20%7C%20MySQL-green.svg)](#tech-stack)
[![Status: Completed](https://img.shields.io/badge/Status-Completed-success.svg)](#project-overview)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> Comprehensive, modular, and role-based **School Management System (SMS)** engineered with a modern Full-Stack MERN architecture (React.js, Node.js, Express.js, and MySQL with JWT Role-Based Access Control).

---

## Project Overview

**Mern_SchoolManagementSystem** is an enterprise-ready educational management ecosystem designed to streamline school administrative operations, academic schedules, staff management, and student-parent engagement. The system isolates concerns through specialized microservice backend entrypoints and distinct frontend dashboards for each stakeholder persona.

### Target Portals & Modules

1. **Super Admin Portal**
   - Multi-tenant school onboarding and subscription management.
   - Global school oversight, plan provisioning, and system auditing.
2. **School Admin Portal**
   - Branch, Academic Year, Batch, Board, Class, Medium, and Section lifecycle management.
   - Staff recruitment, department allocation, and role-based permissions.
   - Student admissions, parent profiles, and fee structures.
   - Comprehensive analytical reporting and request management.
3. **Staff / Teacher Portal**
   - Daily attendance logging, subject-class allocation, and grade management.
   - Teacher profile, schedules, and student performance monitoring.
4. **Student & Parent Portal**
   - Unified dashboard for academic progress, report cards, and attendance tracking.
   - Fee payment status and school notices.

---

## Tech Stack

- **Frontend**: React.js, React Router DOM, Axios, Modern UI Components, CSS3/SCSS
- **Backend**: Node.js, Express.js RESTful APIs (Multi-service architecture)
- **Database**: MySQL (relational schema with foreign keys, indexes, and automated timestamps)
- **Security & Auth**: JSON Web Tokens (JWT), Role-Based Access Control (RBAC), bcrypt hashing, CORS
- **Tooling**: Git, npm workspace scripts, SQL Seeding utilities

---

## Project Structure

```
SMS/
├── backend/
│   ├── config/                     # Database connection pool (MySQL)
│   ├── controller/                 # Business logic controllers
│   │   ├── school-admin/           # School Admin features (Classes, Batches, Staff, etc.)
│   │   ├── staff/                  # Staff dashboard & attendance controllers
│   │   ├── student_parent/         # Student & parent dashboard/profile controllers
│   │   └── super-admin/            # Super Admin operations
│   ├── database/
│   │   └── schema.sql              # Master DDL schema
│   ├── model/                      # Data models and SQL query mappers
│   ├── routes/                     # Express route definitions
│   ├── .env.example                # Sample environment configuration
│   ├── school-admin-api.js         # Dedicated microservice for School Admin (Port 5002)
│   ├── staff-api.js                # Dedicated microservice for Staff (Port 5003)
│   ├── student-parent-api.js       # Dedicated microservice for Student/Parent (Port 5004)
│   ├── super-admin-api.js          # Dedicated microservice for Super Admin (Port 5001)
│   ├── server.js                   # Unified backend launcher
│   └── package.json
│
├── frontend/
│   ├── school-admin/               # React SPA for School Admin
│   ├── staff/                      # React SPA for Teachers & Staff
│   ├── student_parent/             # React SPA for Students & Parents
│   └── super-admin/                # React SPA for Super Admin
│
├── reset_and_seed_gujarat_school.sql # Complete Gujarat School sample seed dataset
├── package.json                    # Workspace orchestrator for one-command execution
├── .gitignore                      # Environment and build artifact exclusions
└── README.md                       # Master project documentation
```

---

## Environment Configuration

Create a `.env` file in the `backend/` directory using the provided `backend/.env.example` as a template:

```env
# Database Credentials
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=sms_db

# JWT Security
JWT_SECRET=your_jwt_secret_token_here

# Microservice API Ports
PORT_SUPER_ADMIN=5001
PORT_SCHOOL_ADMIN=5002
PORT_STAFF=5003
PORT_STUDENT_PARENT=5004
```

---

## Database Setup

1. **Start MySQL Server** (ensure service is active on localhost:3306).
2. **Execute the master schema**:
   ```bash
   mysql -u root -p < backend/database/schema.sql
   ```
3. *(Optional)* To populate a complete pre-configured school dataset (classes, batches, roles, sample students & staff):
   ```bash
   mysql -u root -p sms_db < reset_and_seed_gujarat_school.sql
   ```

---

## Installation & Running

### 1. Install Dependencies

Install all dependencies across the backend and all four frontend applications simultaneously from the root directory:

```bash
npm run install:all
```

Or install them individually:
```bash
# Backend
cd backend && npm install

# Frontends
cd frontend/super-admin && npm install
cd frontend/school-admin && npm install
cd frontend/staff && npm install
cd frontend/student_parent && npm install
```

### 2. Start Backend Microservices

Launch all backend services from the root folder:
```bash
npm run start:backend:super-admin      # Port 5001
npm run start:backend:school-admin     # Port 5002
npm run start:backend:staff            # Port 5003
npm run start:backend:student-parent   # Port 5004
```

### 3. Start Frontend Dashboards

In separate terminals:
```bash
npm run start:frontend:super-admin     # Super Admin Dashboard
npm run start:frontend:school-admin    # School Admin Dashboard
npm run start:frontend:staff           # Staff & Teacher Portal
npm run start:frontend:student-parent  # Student & Parent Portal
```

---

## API Microservice Port Allocation

| Module | Backend Port | Base Endpoint | Frontend Dashboard |
|---|---|---|---|
| **Super Admin** | `5001` | `http://localhost:5001/api/super-admin` | `http://localhost:3000` |
| **School Admin** | `5002` | `http://localhost:5002/api/school-admin` | `http://localhost:3001` |
| **Staff / Teacher** | `5003` | `http://localhost:5003/api/staff` | `http://localhost:3002` |
| **Student / Parent**| `5004` | `http://localhost:5004/api/student-parent` | `http://localhost:3003` |

---

## Security & Access Control

- **JWT Authentication**: Passwords hashed with bcrypt; state secured via JSON Web Tokens passed in `Authorization: Bearer <token>` headers.
- **RBAC (Role-Based Access Control)**: Granular permission checking middleware ensuring staff and students access only authorized endpoints.
- **Input Sanitization**: Parameterized MySQL queries preventing SQL injection vulnerabilities.

---

## Author & Internship Details

- **Developer**: Patel krish
- **Email**: krishpatel7366@gmail.com
- **GitHub**: [Kri306](https://github.com/Kri306)
- **Assigned Mentor**: i3.5.excelsior@gmail.com
- **Program**: MERN Stack Web Development Internship
- **Repository Convention**: `Mern_ProjectModuleName` -> `Mern_SchoolManagementSystem`

---

## License

This project is licensed under the MIT License.
