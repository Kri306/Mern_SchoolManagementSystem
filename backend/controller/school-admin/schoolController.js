const SchoolModel = require('../../model/school-admin/schoolModel');

class SchoolController {
  /**
   * View School Profile
   */
  static async getSchoolProfile(req, res) {
    try {
      const schoolId = req.user.school_id;
      if (!schoolId) {
        return res.status(400).json({
          success: false,
          message: 'School ID not found in token'
        });
      }

      const schoolProfile = await SchoolModel.getSchoolById(schoolId);
      if (!schoolProfile) {
        return res.status(404).json({
          success: false,
          message: 'School profile not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: schoolProfile
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Update School Profile
   */
  static async updateSchoolProfile(req, res) {
    try {
      const schoolId = req.user.school_id;
      if (!schoolId) {
        return res.status(400).json({
          success: false,
          message: 'School ID not found in token'
        });
      }

      const {
        name,
        school_code,
        address,
        contact_number,
        email_id,
        logo,
        website_link,
        working_hours,
        bank_details,
        telegram_channel_id
      } = req.body;

      if (!name || !school_code) {
        return res.status(400).json({
          success: false,
          message: 'School name and school code are required'
        });
      }

      await SchoolModel.updateSchool(schoolId, {
        name,
        school_code,
        address,
        contact_number,
        email_id,
        logo,
        website_link,
        working_hours,
        bank_details,
        telegram_channel_id
      });

      return res.status(200).json({
        success: true,
        message: 'School profile updated successfully'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = SchoolController;
