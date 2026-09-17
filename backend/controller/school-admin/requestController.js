const RequestModel = require('../../model/school-admin/requestModel');

class RequestController {
  // Get aggregate requests list
  static async getRequests(req, res) {
    try {
      const schoolId = req.user.school_id;
      const { status } = req.query; // e.g. Pending, Approved, Rejected

      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }

      const requests = await RequestModel.getRequests(schoolId, status);
      res.status(200).json({
        success: true,
        data: requests
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = RequestController;
