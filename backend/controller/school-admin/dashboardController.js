const DashboardModel = require('../../model/school-admin/dashboardModel');

class DashboardController {
  /**
   * Get metrics for the school admin dashboard
   */
  static async getMetrics(req, res) {
    try {
      const schoolId = req.user.school_id;
      if (!schoolId) {
        return res.status(400).json({
          success: false,
          message: 'School ID not found in token'
        });
      }

      const metrics = await DashboardModel.getDashboardMetrics(schoolId);
      return res.status(200).json({
        success: true,
        data: metrics
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = DashboardController;
