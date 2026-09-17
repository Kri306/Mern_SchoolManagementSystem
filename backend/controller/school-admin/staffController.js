const StaffModel = require('../../model/school-admin/staffModel');

class StaffController {
  // Create Staff
  static async createStaff(req, res) {
    try {
      const staffData = {
        ...req.body,
        school_id: req.user.school_id,
        created_by: req.user.id
      };
      const result = await StaffModel.createStaff(staffData);
      res.status(201).json({
        success: true,
        message: 'Staff registered successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get Staff by School
  static async getStaff(req, res) {
    try {
      const schoolId = req.user.school_id;
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }  
      const staff = await StaffModel.getStaff(schoolId);
      res.status(200).json({
        success: true,
        data: staff
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get Staff by ID
  static async getStaffById(req, res) {
    try {
      const schoolId = req.user.school_id;
      const staffId = parseInt(req.params.id, 10);
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }
      const staff = await StaffModel.getStaffById(schoolId, staffId);
      if (!staff) {
        return res.status(404).json({ success: false, message: 'Staff member not found' });
      }
      res.status(200).json({
        success: true,
        data: staff
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update Staff Details
  static async updateStaff(req, res) {
    try {
      const schoolId = req.user.school_id;
      const staffId = parseInt(req.params.id, 10);
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }
      const staffData = req.body;
      await StaffModel.updateStaff(schoolId, staffId, staffData);
      res.status(200).json({
        success: true,
        message: 'Staff profile updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Toggle Staff Status
  static async toggleStaffStatus(req, res) {
    try {
      const schoolId = req.user.school_id;
      const staffId = parseInt(req.params.id, 10);
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }
      const newStatus = await StaffModel.toggleStaffStatus(schoolId, staffId);
      res.status(200).json({
        success: true,
        message: `Staff status updated to ${newStatus}`,
        data: { status: newStatus }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get Staff Types list
  static async getStaffTypes(req, res) {
    try {
      const types = await StaffModel.getStaffTypes();
      res.status(200).json({
        success: true,
        data: types
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get Staff Departments list
  static async getStaffDepartments(req, res) {
    try {
      const depts = await StaffModel.getStaffDepartments();
      res.status(200).json({
        success: true,
        data: depts
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = StaffController;
