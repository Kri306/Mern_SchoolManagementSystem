const BoardModel = require('../../model/school-admin/boardModel');

class BoardController {
  // Get boards linked to current school
  static async getSchoolBoards(req, res) {
    try {
      const schoolId = req.user.school_id;
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }
      const boards = await BoardModel.getSchoolBoards(schoolId);
      res.status(200).json({
        success: true,
        data: boards
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get master boards
  static async getMasterBoards(req, res) {
    try {
      const schoolId = req.user.school_id;
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }
      const masterBoards = await BoardModel.getMasterBoards(schoolId);
      res.status(200).json({
        success: true,
        data: masterBoards
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Request association or new custom board
  static async requestBoard(req, res) {
    try {
      const schoolId = req.user.school_id;
      const { master_board_id, name, description, logo, custom_board_name, custom_board_logo, custom_description } = req.body;

      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }

      if (master_board_id) {
        // Link to existing
        const result = await BoardModel.requestExistingBoard(
          schoolId, 
          master_board_id, 
          custom_board_name, 
          custom_board_logo, 
          custom_description
        );
        return res.status(201).json({
          success: true,
          message: 'Board request submitted successfully',
          data: result
        });
      } else {
        // Create custom board
        if (!name) {
          return res.status(400).json({ success: false, message: 'Board name is required for custom requests' });
        }
        const result = await BoardModel.requestCustomBoard(schoolId, name, description, logo);
        return res.status(201).json({
          success: true,
          message: 'Custom board request submitted successfully',
          data: result
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Toggle active/inactive status of a school board link
  static async toggleBoardStatus(req, res) {
    try {
      const schoolId = req.user.school_id;
      const schoolBoardId = parseInt(req.params.id, 10);

      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }

      const newStatus = await BoardModel.toggleBoardStatus(schoolId, schoolBoardId);
      res.status(200).json({
        success: true,
        message: `Board status updated to ${newStatus}`,
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

module.exports = BoardController;
