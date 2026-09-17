const BatchModel = require('../../model/school-admin/batchModel');

class BatchController {
  // Get all batches for school
  static async getBatches(req, res) {
    try {
      const schoolId = req.user.school_id;
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }
      const batches = await BatchModel.getBatches(schoolId);
      res.status(200).json({
        success: true,
        data: batches
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get batch by ID
  static async getBatchById(req, res) {
    try {
      const schoolId = req.user.school_id;
      const batchId = parseInt(req.params.id, 10);
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }
      const batch = await BatchModel.getBatchById(schoolId, batchId);
      if (!batch) {
        return res.status(404).json({ success: false, message: 'Batch not found' });
      }
      res.status(200).json({
        success: true,
        data: batch
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Create Batch
  static async createBatch(req, res) {
    try {
      const schoolId = req.user.school_id;
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }
      const batchData = {
        ...req.body,
        created_by: req.user.id
      };

      if (!batchData.batch_code || !batchData.school_class_id || !batchData.academic_year_id || !batchData.section_id) {
        return res.status(400).json({
          success: false,
          message: 'Batch Code, School Class ID, Academic Year ID, and Section ID are required'
        });
      }

      const result = await BatchModel.createBatch(schoolId, batchData);
      res.status(201).json({
        success: true,
        message: 'Batch created successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update Batch
  static async updateBatch(req, res) {
    try {
      const schoolId = req.user.school_id;
      const batchId = parseInt(req.params.id, 10);
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }
      const batchData = req.body;

      if (!batchData.batch_code || !batchData.school_class_id || !batchData.academic_year_id || !batchData.section_id) {
        return res.status(400).json({
          success: false,
          message: 'Batch Code, School Class ID, Academic Year ID, and Section ID are required'
        });
      }

      await BatchModel.updateBatch(schoolId, batchId, batchData);
      res.status(200).json({
        success: true,
        message: 'Batch updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Assign teacher
  static async assignTeacher(req, res) {
    try {
      const schoolId = req.user.school_id;
      const batchId = parseInt(req.params.id, 10);
      const { teacher_id } = req.body;

      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }

      await BatchModel.assignTeacher(schoolId, batchId, teacher_id);
      res.status(200).json({
        success: true,
        message: 'Teacher assigned to batch successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Toggle Batch Status
  static async toggleBatchStatus(req, res) {
    try {
      const schoolId = req.user.school_id;
      const batchId = parseInt(req.params.id, 10);
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }
      const newStatus = await BatchModel.toggleBatchStatus(schoolId, batchId);
      res.status(200).json({
        success: true,
        message: `Batch status updated to ${newStatus}`,
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

module.exports = BatchController;
