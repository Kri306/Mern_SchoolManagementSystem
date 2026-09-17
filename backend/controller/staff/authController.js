const AuthModel = require('../../model/staff/authModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class AuthController {
  /**
   * Staff Login Controller
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

      const user = await AuthModel.getStaffByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Compare password hash
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        // Audit failed login attempt (user exists, but password mismatch)
        await AuthModel.logLogin(user.user_id, ipAddress, userAgent, 'Failed', 'Invalid password');
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Audit successful login
      await AuthModel.logLogin(user.user_id, ipAddress, userAgent, 'Success', null);

      // Generate JWT Token
      const token = jwt.sign(
        {
          id: user.id,
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          role_id: user.role_id,
          school_id: user.school_id,
          branch_id: user.branch_id
        },
        process.env.JWT_SECRET || 'super_secret_token_1234_sms',
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        success: true,
        message: 'Staff authenticated successfully',
        token,
        user: {
          id: user.id,
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          role_id: user.role_id,
          role_name: user.role_name,
          school_id: user.school_id,
          school_name: user.school_name,
          school_code: user.school_code,
          branch_id: user.branch_id,
          branch_name: user.branch_name,
          branch_code: user.branch_code,
          staff_type: user.staff_type,
          department_name: user.department_name
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
   * Get login history for the authenticated staff member
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

  /**
   * Staff Registration Controller
   */
  static async register(req, res) {
    try {
      const { name, email, phone_number, school_id, branch_id, staff_type_id, department_id, password } = req.body;

      if (!name || !email || !school_id || !branch_id || !staff_type_id || !department_id || !password) {
        return res.status(400).json({
          success: false,
          message: 'All fields (name, email, school_id, branch_id, staff_type_id, department_id, password) are required'
        });
      }

      // Check if email already registered
      const existingUser = await AuthModel.getStaffByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists'
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Register staff
      await AuthModel.registerStaff({
        name,
        email,
        phone_number,
        school_id,
        branch_id,
        staff_type_id,
        department_id,
        password: hashedPassword
      });

      return res.status(201).json({
        success: true,
        message: 'Staff account registered successfully. You can now log in.'
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
   * Get Staff Types List for self registration dropdown
   */
  static async getStaffTypesList(req, res) {
    try {
      const types = await AuthModel.getStaffTypesList();
      return res.status(200).json({
        success: true,
        data: types
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get Departments List for self registration dropdown
   */
  static async getDepartmentsList(req, res) {
    try {
      const departments = await AuthModel.getDepartmentsList();
      return res.status(200).json({
        success: true,
        data: departments
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
