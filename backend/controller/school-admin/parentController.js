const ParentModel = require('../../model/school-admin/parentModel');

class ParentController {
  // Get all parents for school
  static async getParents(req, res) {
    try {
      const schoolId = req.user.school_id;
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }
      const parents = await ParentModel.getParents(schoolId);
      res.status(200).json({
        success: true,
        data: parents
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get parent by ID
  static async getParentById(req, res) {
    try {
      const schoolId = req.user.school_id;
      const parentId = parseInt(req.params.id, 10);
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }
      const parent = await ParentModel.getParentById(schoolId, parentId);
      if (!parent) {
        return res.status(404).json({ success: false, message: 'Parent not found' });
      }
      res.status(200).json({
        success: true,
        data: parent
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Create Parent
  static async createParent(req, res) {
    try {
      const schoolId = req.user.school_id;
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }
      const parentData = {
        ...req.body,
        created_by: req.user.id
      };

      if (!parentData.name || !parentData.phone) {
        return res.status(400).json({
          success: false,
          message: 'Parent Name and Phone Number are required'
        });
      }

      const result = await ParentModel.createParent(schoolId, parentData);
      res.status(201).json({
        success: true,
        message: 'Parent registered successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update Parent
  static async updateParent(req, res) {
    try {
      const schoolId = req.user.school_id;
      const parentId = parseInt(req.params.id, 10);
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }
      const parentData = req.body;

      if (!parentData.name || !parentData.phone) {
        return res.status(400).json({
          success: false,
          message: 'Parent Name and Phone Number are required'
        });
      }

      await ParentModel.updateParent(schoolId, parentId, parentData);
      res.status(200).json({
        success: true,
        message: 'Parent profile updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Toggle Parent Status
  static async toggleParentStatus(req, res) {
    try {
      const schoolId = req.user.school_id;
      const parentId = parseInt(req.params.id, 10);
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }
      const newStatus = await ParentModel.toggleParentStatus(schoolId, parentId);
      res.status(200).json({
        success: true,
        message: `Parent status updated to ${newStatus}`,
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

module.exports = ParentController;
