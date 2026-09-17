const ProfileModel = require('../../model/student_parent/profileModel');

class ProfileController {
  // Get Student Profile
  static async getStudentProfile(req, res) {
    try {
      const { studentId } = req.query;
      if (!studentId) {
        return res.status(400).json({ success: false, message: 'Student ID is required' });
      }
      const profile = await ProfileModel.getStudentProfile(studentId);
      res.status(200).json({
        success: true,
        data: profile
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Change Password
  static async changePassword(req, res) {
    try {
      const userId = req.user.user_id;
      const profileId = req.user.id;
      const roleId = req.user.role_id;
      const { newPassword } = req.body;

      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters long'
        });
      }

      await ProfileModel.changePassword(userId, profileId, roleId, newPassword);
      res.status(200).json({
        success: true,
        message: 'Password updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = ProfileController;
