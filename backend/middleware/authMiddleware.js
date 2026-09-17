const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware to verify JWT tokens and authorize roles.
 * @param {Array<number>} allowedRoles - List of role_ids allowed to access the route
 */
const authMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: 'Access denied. No token provided.'
        });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_token_1234_sms');

      // Attach user payload to the request object
      req.user = decoded;

      // Check if user role is authorized
      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role_id)) {
        return res.status(403).json({
          success: false,
          message: 'Access forbidden. Insufficient permissions.'
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token.'
      });
    }
  };
};

module.exports = authMiddleware;
