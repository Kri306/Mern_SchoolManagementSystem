const ProfileModel = require('../../model/school-admin/profileModel');

class ProfileController {
  // Get admin profile details
  static async getProfile(req, res) {
    try {
      const adminId = req.user.id; // School admin ID
      const schoolId = req.user.school_id;

      if (!adminId || !schoolId) {
        return res.status(400).json({ success: false, message: 'Invalid admin credentials in token' });
      }

      const profile = await ProfileModel.getProfile(adminId, schoolId);
      if (!profile) {
        return res.status(404).json({ success: false, message: 'Profile not found' });
      }

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

  // Update admin profile details
  static async updateProfile(req, res) {
    try {
      const adminId = req.user.id;
      const schoolId = req.user.school_id;
      const userId = req.user.user_id;
      const profileData = req.body;

      if (!adminId || !schoolId || !userId) {
        return res.status(400).json({ success: false, message: 'Invalid admin credentials in token' });
      }
      if (!profileData.name || !profileData.email) {
        return res.status(400).json({ success: false, message: 'Name and Email are required' });
      }

      await ProfileModel.updateProfile(adminId, schoolId, userId, profileData);
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Change password
  static async changePassword(req, res) {
    try {
      const userId = req.user.user_id;
      const { oldPassword, newPassword } = req.body;

      if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID not found in token' });
      }
      if (!oldPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Old and new passwords are required' });
      }

      await ProfileModel.changePassword(userId, oldPassword, newPassword);
      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
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
