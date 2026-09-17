const SchoolModel = require('../../model/super-admin/schoolModel');

class SchoolController {
  // Create School
  static async createSchool(req, res) {
    try {
      const result = await SchoolModel.createSchool(req.body);
      res.status(201).json({
        success: true,
        message: 'School created successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get All Schools
  static async getAllSchools(req, res) {
    try {
      const schools = await SchoolModel.getAllSchools();
      res.status(200).json({
        success: true,
        data: schools
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Create School Admin
  static async createSchoolAdmin(req, res) {
    try {
      const result = await SchoolModel.createSchoolAdmin(req.body);
      res.status(201).json({
        success: true,
        message: 'School Admin created successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get All School Admins
  static async getSchoolAdmins(req, res) {
    try {
      const admins = await SchoolModel.getSchoolAdmins();
      res.status(200).json({
        success: true,
        data: admins
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Approve or Reject School Admin
  static async approveSchoolAdmin(req, res) {
    try {
      const adminId = parseInt(req.params.id, 10);
      const { status } = req.body;
      const approvedBy = req.user?.id || null;

      if (!status || !['Approved', 'Rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status must be Approved or Rejected'
        });
      }

      await SchoolModel.approveSchoolAdmin(adminId, status, approvedBy);

      res.status(200).json({
        success: true,
        message: `School Admin status updated to ${status} successfully`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = SchoolController;
