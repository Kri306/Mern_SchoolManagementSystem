const BranchModel = require('../../model/school-admin/branchModel');

class BranchController {
  // Create Branch
  static async createBranch(req, res) {
    try {
      const branchData = {
        ...req.body,
        school_id: req.user.school_id,
        created_by: req.user.id
      };
      const result = await BranchModel.createBranch(branchData);
      res.status(201).json({
        success: true,
        message: 'Branch created successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get Branches by School
  static async getBranches(req, res) {
    try {
      const schoolId = req.user.school_id;
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }
      const branches = await BranchModel.getBranches(schoolId);
      res.status(200).json({
        success: true,
        data: branches
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get Branch by ID
  static async getBranchById(req, res) {
    try {
      const schoolId = req.user.school_id;
      const branchId = parseInt(req.params.id, 10);
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }
      const branch = await BranchModel.getBranchById(schoolId, branchId);
      if (!branch) {
        return res.status(404).json({ success: false, message: 'Branch not found' });
      }
      res.status(200).json({
        success: true,
        data: branch
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update Branch
  static async updateBranch(req, res) {
    try {
      const schoolId = req.user.school_id;
      const branchId = parseInt(req.params.id, 10);
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }
      const branchData = req.body;
      await BranchModel.updateBranch(schoolId, branchId, branchData);
      res.status(200).json({
        success: true,
        message: 'Branch updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Toggle Branch Status
  static async toggleBranchStatus(req, res) {
    try {
      const schoolId = req.user.school_id;
      const branchId = parseInt(req.params.id, 10);
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }
      const newStatus = await BranchModel.toggleBranchStatus(schoolId, branchId);
      res.status(200).json({
        success: true,
        message: `Branch status updated to ${newStatus}`,
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

module.exports = BranchController;
