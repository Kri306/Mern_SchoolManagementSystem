const ClassModel = require('../../model/school-admin/classModel');

class ClassController {
  // Get master classes list
  static async getMasterClasses(req, res) {
    try {
      const classes = await ClassModel.getMasterClasses();
      res.status(200).json({
        success: true,
        data: classes
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Add global class to master
  static async createMasterClass(req, res) {
    try {
      const classData = {
        ...req.body,
        created_by: req.user.id
      };

      if (!classData.class_name) {
        return res.status(400).json({
          success: false,
          message: 'Class name is required'
        });
      }

      const result = await ClassModel.createMasterClass(classData);
      res.status(201).json({
        success: true,
        message: 'Master class created successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get classes assigned to current school
  static async getSchoolClasses(req, res) {
    try {
      const schoolId = req.user.school_id;
      const branchId = parseInt(req.query.branch_id || 1, 10); // default branch ID if not provided

      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }

      const classes = await ClassModel.getSchoolClasses(schoolId, branchId);
      res.status(200).json({
        success: true,
        data: classes
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get single school class assignment detail
  static async getSchoolClassById(req, res) {
    try {
      const schoolId = req.user.school_id;
      const schoolClassId = parseInt(req.params.id, 10);

      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }

      const schoolClass = await ClassModel.getSchoolClassById(schoolId, schoolClassId);
      if (!schoolClass) {
        return res.status(404).json({ success: false, message: 'School class assignment not found' });
      }

      res.status(200).json({
        success: true,
        data: schoolClass
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Assign class to branch
  static async assignClassToBranch(req, res) {
    try {
      const schoolId = req.user.school_id;
      const assignmentData = {
        ...req.body,
        created_by: req.user.id
      };

      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }
      if (!assignmentData.class_id || !assignmentData.branch_id) {
        return res.status(400).json({
          success: false,
          message: 'Class ID and Branch ID are required'
        });
      }

      const result = await ClassModel.assignClassToBranch(schoolId, assignmentData);
      res.status(201).json({
        success: true,
        message: 'Class assigned to branch successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update school class assignment details
  static async updateSchoolClass(req, res) {
    try {
      const schoolId = req.user.school_id;
      const schoolClassId = parseInt(req.params.id, 10);
      const updateData = req.body;

      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }
      if (!updateData.branch_id) {
        return res.status(400).json({ success: false, message: 'Branch ID is required' });
      }

      await ClassModel.updateSchoolClass(schoolId, schoolClassId, updateData);
      res.status(200).json({
        success: true,
        message: 'School class assignment updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Toggle school class status
  static async toggleClassStatus(req, res) {
    try {
      const schoolId = req.user.school_id;
      const schoolClassId = parseInt(req.params.id, 10);

      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }

      const newStatus = await ClassModel.toggleClassStatus(schoolId, schoolClassId);
      res.status(200).json({
        success: true,
        message: `Class assignment status updated to ${newStatus}`,
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

module.exports = ClassController;
