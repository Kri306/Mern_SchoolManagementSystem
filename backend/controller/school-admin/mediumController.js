const MediumModel = require('../../model/school-admin/mediumModel');

class MediumController {
  // Get mediums linked to current school
  static async getSchoolMediums(req, res) {
    try {
      const schoolId = req.user.school_id;
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }
      const mediums = await MediumModel.getSchoolMediums(schoolId);
      res.status(200).json({
        success: true,
        data: mediums
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get master mediums
  static async getMasterMediums(req, res) {
    try {
      const schoolId = req.user.school_id;
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }
      const masterMediums = await MediumModel.getMasterMediums(schoolId);
      res.status(200).json({
        success: true,
        data: masterMediums
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Request association or new custom medium
  static async requestMedium(req, res) {
    try {
      const schoolId = req.user.school_id;
      const { master_medium_id, name, description, custom_medium_name } = req.body;

      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }

      if (master_medium_id) {
        // Link to existing
        const result = await MediumModel.requestExistingMedium(schoolId, master_medium_id, custom_medium_name);
        return res.status(201).json({
          success: true,
          message: 'Medium request submitted successfully',
          data: result
        });
      } else {
        // Create custom medium
        if (!name) {
          return res.status(400).json({ success: false, message: 'Medium name is required for custom requests' });
        }
        const result = await MediumModel.requestCustomMedium(schoolId, name, description);
        return res.status(201).json({
          success: true,
          message: 'Custom medium request submitted successfully',
          data: result
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Toggle active/inactive status of a school medium link
  static async toggleMediumStatus(req, res) {
    try {
      const schoolId = req.user.school_id;
      const schoolMediumId = parseInt(req.params.id, 10);

      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }

      const newStatus = await MediumModel.toggleMediumStatus(schoolId, schoolMediumId);
      res.status(200).json({
        success: true,
        message: `Medium status updated to ${newStatus}`,
        data: { status: newStatus }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = MediumController;
