const AcademicYearModel = require('../../model/school-admin/academicYearModel');

class AcademicYearController {
  // Get all academic years
  static async getAcademicYears(req, res) {
    try {
      const schoolId = req.user.school_id;
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }
      const years = await AcademicYearModel.getAcademicYears(schoolId);
      res.status(200).json({
        success: true,
        data: years
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get academic year by ID
  static async getAcademicYearById(req, res) {
    try {
      const schoolId = req.user.school_id;
      const yearId = parseInt(req.params.id, 10);
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }
      const year = await AcademicYearModel.getAcademicYearById(schoolId, yearId);
      if (!year) {
        return res.status(404).json({ success: false, message: 'Academic Year not found' });
      }
      res.status(200).json({
        success: true,
        data: year
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Create Academic Year
  static async createAcademicYear(req, res) {
    try {
      const schoolId = req.user.school_id;
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }
      const yearData = {
        ...req.body,
        school_id: schoolId,
        created_by: req.user.id
      };

      if (!yearData.academic_year_name) {
        return res.status(400).json({
          success: false,
          message: 'Academic Year Name is required'
        });
      }

      const result = await AcademicYearModel.createAcademicYear(yearData);
      res.status(201).json({
        success: true,
        message: 'Academic Year created successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update Academic Year
  static async updateAcademicYear(req, res) {
    try {
      const schoolId = req.user.school_id;
      const yearId = parseInt(req.params.id, 10);
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }
      const yearData = req.body;

      if (!yearData.academic_year_name) {
        return res.status(400).json({
          success: false,
          message: 'Academic Year Name is required'
        });
      }

      await AcademicYearModel.updateAcademicYear(schoolId, yearId, yearData);
      res.status(200).json({
        success: true,
        message: 'Academic Year updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Set Academic Year as current
  static async setCurrentYear(req, res) {
    try {
      const schoolId = req.user.school_id;
      const yearId = parseInt(req.params.id, 10);
      if (!schoolId) {
        return res.status(400).json({ success: false, message: 'School ID not found in token' });
      }
      await AcademicYearModel.setCurrentYear(schoolId, yearId);
      res.status(200).json({
        success: true,
        message: 'Academic Year set as current term successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // --- SESSIONS CONTROLLERS ---

  // Get sessions by academic year ID
  static async getSessionsByYear(req, res) {
    try {
      const yearId = parseInt(req.params.yearId, 10);
      const sessions = await AcademicYearModel.getSessionsByYear(yearId);
      res.status(200).json({
        success: true,
        data: sessions
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Create session inside an academic year
  static async createSession(req, res) {
    try {
      const yearId = parseInt(req.params.yearId, 10);
      const sessionData = {
        ...req.body,
        academic_year_id: yearId,
        created_by: req.user.id
      };

      if (!sessionData.session_name) {
        return res.status(400).json({
          success: false,
          message: 'Session Name is required'
        });
      }

      const result = await AcademicYearModel.createSession(sessionData);
      res.status(201).json({
        success: true,
        message: 'Session created successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update session details
  static async updateSession(req, res) {
    try {
      const yearId = parseInt(req.params.yearId, 10);
      const sessionId = parseInt(req.params.sessionId, 10);
      const sessionData = req.body;

      if (!sessionData.session_name) {
        return res.status(400).json({
          success: false,
          message: 'Session Name is required'
        });
      }

      await AcademicYearModel.updateSession(yearId, sessionId, sessionData);
      res.status(200).json({
        success: true,
        message: 'Session updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Set session as current term
  static async setCurrentSession(req, res) {
    try {
      const yearId = parseInt(req.params.yearId, 10);
      const sessionId = parseInt(req.params.sessionId, 10);

      await AcademicYearModel.setCurrentSession(yearId, sessionId);
      res.status(200).json({
        success: true,
        message: 'Session set as current term successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = AcademicYearController;
