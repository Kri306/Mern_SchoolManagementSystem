const SectionModel = require('../../model/school-admin/sectionModel');

class SectionController {
  // Get all sections
  static async getSections(req, res) {
    try {
      const sections = await SectionModel.getSections();
      res.status(200).json({
        success: true,
        data: sections
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get section by ID
  static async getSectionById(req, res) {
    try {
      const sectionId = parseInt(req.params.id, 10);
      const section = await SectionModel.getSectionById(sectionId);
      if (!section) {
        return res.status(404).json({ success: false, message: 'Section not found' });
      }
      res.status(200).json({
        success: true,
        data: section
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Create Section
  static async createSection(req, res) {
    try {
      const sectionData = {
        ...req.body,
        created_by: req.user.id
      };

      if (!sectionData.section_name) {
        return res.status(400).json({
          success: false,
          message: 'Section name is required'
        });
      }

      const result = await SectionModel.createSection(sectionData);
      res.status(201).json({
        success: true,
        message: 'Section created successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update Section details
  static async updateSection(req, res) {
    try {
      const sectionId = parseInt(req.params.id, 10);
      const sectionData = req.body;

      if (!sectionData.section_name) {
        return res.status(400).json({
          success: false,
          message: 'Section name is required'
        });
      }

      await SectionModel.updateSection(sectionId, sectionData);
      res.status(200).json({
        success: true,
        message: 'Section updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Toggle Section Status
  static async toggleSectionStatus(req, res) {
    try {
      const sectionId = parseInt(req.params.id, 10);
      const newStatus = await SectionModel.toggleSectionStatus(sectionId);
      res.status(200).json({
        success: true,
        message: `Section status updated to ${newStatus}`,
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

module.exports = SectionController;
