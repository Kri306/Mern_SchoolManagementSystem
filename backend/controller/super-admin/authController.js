const AuthModel = require('../../model/super-admin/authModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class AuthController {
  /**
   * Super Admin Login Controller
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      const user = await AuthModel.getSuperAdminByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Compare hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Generate JWT Token
      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role_id: user.role_id
        },
        process.env.JWT_SECRET || 'super_secret_token_1234_sms',
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        success: true,
        message: 'Super Admin authenticated successfully',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role_id: user.role_id
        }
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
