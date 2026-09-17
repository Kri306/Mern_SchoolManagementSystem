const ReportModel = require('../../model/school-admin/reportModel');

class ReportController {
  // Get student distribution by class
  static async getStudentDistribution(req, res) {
    try {
      const schoolId = req.user.school_id;
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }
      const data = await ReportModel.getStudentDistributionByClass(schoolId);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get staff distribution by department
  static async getStaffDistribution(req, res) {
    try {
      const schoolId = req.user.school_id;
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }
      const data = await ReportModel.getStaffDistributionByDepartment(schoolId);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get summary of all school branches
  static async getBranchSummary(req, res) {
    try {
      const schoolId = req.user.school_id;
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }
      const data = await ReportModel.getBranchSummary(schoolId);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = ReportController;
