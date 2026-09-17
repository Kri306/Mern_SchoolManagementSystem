const AuthModel = require('../../model/student_parent/authModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class AuthController {
  /**
   * Student/Parent Login Controller (Email & Password based)
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      // Check if user exists in tbl_users
      const user = await AuthModel.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Check if user has Student (role_id 4) or Parent (role_id 5) role
      if (user.role_id !== 4 && user.role_id !== 5) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You do not have student or parent permissions.'
        });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        // Audit failed login
        await AuthModel.logLogin(user.id, ipAddress, userAgent, 'Failed', 'Invalid password');
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Audit successful login
      await AuthModel.logLogin(user.id, ipAddress, userAgent, 'Success', null);

      // Fetch corresponding profile details
      let profile = null;
      if (user.role_id === 4) {
        profile = await AuthModel.getStudentProfileByUserId(user.id);
      } else if (user.role_id === 5) {
        profile = await AuthModel.getParentProfileByUserId(user.id);
      }

      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'Profile not found'
        });
      }

      // Generate JWT Token
      const token = jwt.sign(
        {
          id: profile.id,
          user_id: user.id,
          name: profile.name,
          email: profile.email,
          role_id: user.role_id,
          school_id: profile.school_id,
          batch_id: profile.batch_id || null
        },
        process.env.JWT_SECRET || 'super_secret_token_1234_sms',
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        success: true,
        message: `${user.role_id === 4 ? 'Student' : 'Parent'} authenticated successfully`,
        token,
        user: {
          id: profile.id,
          user_id: user.id,
          name: profile.name,
          email: profile.email,
          role_id: user.role_id,
          role_name: user.role_id === 4 ? 'Student' : 'Parent',
          school_id: profile.school_id,
          school_name: profile.school_name,
          school_code: profile.school_code,
          branch_id: profile.branch_id || null,
          branch_name: profile.branch_name || null,
          batch_id: profile.batch_id || null,
          batch_code: profile.batch_code || null,
          student_unique_id: profile.student_unique_id || null
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Student/Parent Registration Controller
   */
  static async register(req, res) {
    try {
      const { name, email, phone_number, school_id, branch_id, role, student_unique_id, admission_number, password } = req.body;

      if (!name || !email || !school_id || !branch_id || !role || !password) {
        return res.status(400).json({
          success: false,
          message: 'Required fields (name, email, school_id, branch_id, role, password) are missing'
        });
      }

      if (role !== 'student' && role !== 'parent') {
        return res.status(400).json({
          success: false,
          message: 'Invalid role. Must be student or parent.'
        });
      }

      // Check if email already exists in tbl_users
      const existingUser = await AuthModel.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists'
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      if (role === 'student') {
        if (!student_unique_id || !admission_number) {
          return res.status(400).json({
            success: false,
            message: 'Student registration requires Unique ID and Admission Number'
          });
        }

        await AuthModel.registerStudent({
          name,
          email,
          phone_number,
          school_id: parseInt(school_id),
          branch_id: parseInt(branch_id),
          student_unique_id,
          admission_number,
          password: hashedPassword
        });
      } else {
        await AuthModel.registerParent({
          name,
          email,
          phone_number,
          school_id: parseInt(school_id),
          branch_id: parseInt(branch_id),
          password: hashedPassword
        });
      }

      return res.status(201).json({
        success: true,
        message: `${role.charAt(0).toUpperCase() + role.slice(1)} account registered successfully. You can now log in.`
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get Schools List for self registration dropdown
   */
  static async getSchoolsList(req, res) {
    try {
      const schools = await AuthModel.getSchoolsList();
      return res.status(200).json({
        success: true,
        data: schools
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get Branches List for selected school
   */
  static async getBranchesList(req, res) {
    try {
      const { schoolId } = req.params;
      if (!schoolId) {
        return res.status(400).json({
          success: false,
          message: 'School ID is required'
        });
      }
      const branches = await AuthModel.getBranchesList(schoolId);
      return res.status(200).json({
        success: true,
        data: branches
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get login history for the authenticated student/parent member
   */
  static async getLoginHistory(req, res) {
    try {
      const userId = req.user.user_id;
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID not found in token'
        });
      }
      const history = await AuthModel.getLoginHistory(userId);
      return res.status(200).json({
        success: true,
        data: history
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = AuthController;
