const AuthModel = require('../../model/school-admin/authModel');
const SchoolModel = require('../../model/super-admin/schoolModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class AuthController {
  /**
   * School Admin Login Controller
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

      const user = await AuthModel.getSchoolAdminByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Check registration status for security
      if (user.registration_status !== 'Approved') {
        return res.status(403).json({
          success: false,
          message: `Login blocked. Your registration status is: ${user.registration_status}`
        });
      }

      // Compare hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        // Audit failed login
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
          school_id: user.school_id
        },
        process.env.JWT_SECRET || 'super_secret_token_1234_sms',
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        success: true,
        message: 'School Admin authenticated successfully',
        token,
        user: {
          id: user.id,
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          role_id: user.role_id,
          role_name: user.role_name || 'School Admin',
          school_id: user.school_id,
          school_name: user.school_name,
          school_code: user.school_code
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
   * School Admin Register Controller
   */
  static async register(req, res) {
    try {
      const {
        school_id,
        name,
        email,
        phone_number,
        password,
        school_name,
        school_code,
        school_address,
        school_contact,
        school_email,
        school_logo,
        school_website,
        school_working_hours,
        school_bank_details,
        school_telegram
      } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Name, email, and password are required'
        });
      }

      // Check if user already exists
      const existingUser = await AuthModel.getSchoolAdminByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists'
        });
      }

      let targetSchoolId = school_id;

      // If school_id is not provided, we register a new school
      if (!targetSchoolId) {
        if (!school_name || !school_code) {
          return res.status(400).json({
            success: false,
            message: 'School name and school code are required to register a new school'
          });
        }

        const schoolResult = await SchoolModel.createSchool({
          name: school_name,
          school_code,
          address: school_address,
          contact_number: school_contact,
          email_id: school_email,
          logo: school_logo,
          website_link: school_website,
          working_hours: school_working_hours,
          bank_details: school_bank_details,
          telegram_channel_id: school_telegram,
          created_by: null
        });

        if (schoolResult && schoolResult[0] && schoolResult[0].school_id) {
          targetSchoolId = schoolResult[0].school_id;
        } else if (schoolResult && schoolResult.school_id) {
          targetSchoolId = schoolResult.school_id;
        } else {
          targetSchoolId = schoolResult.insertId || schoolResult;
        }
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Register the school admin (in Pending status)
      await AuthModel.registerSchoolAdmin({
        school_id: targetSchoolId,
        name,
        email,
        phone_number,
        password: hashedPassword
      });

      return res.status(201).json({
        success: true,
        message: 'School Admin registered successfully. Awaiting Super Admin approval.'
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
   * Get login history for the authenticated school admin
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
