const DashboardModel = require('../../model/staff/dashboardModel');

class DashboardController {
  // Get Summary
  static async getSummary(req, res) {
    try {
      const teacherId = req.user.id;
      const schoolId = req.user.school_id;
      const branchId = req.user.branch_id;

      if (!teacherId || !schoolId || !branchId) {
        return res.status(400).json({
          success: false,
          message: 'Required token fields (teacher_id, school_id, branch_id) are missing'
        });
      }

      const data = await DashboardModel.getSummary(teacherId, schoolId, branchId);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get Profile
  static async getProfile(req, res) {
    try {
      const teacherId = req.user.id;
      const profile = await DashboardModel.getProfile(teacherId);
      res.status(200).json({
        success: true,
        data: profile
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get Batches
  static async getBatches(req, res) {
    try {
      const teacherId = req.user.id;
      const batches = await DashboardModel.getBatches(teacherId);
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

  // Get Students
  static async getStudents(req, res) {
    try {
      const teacherId = req.user.id;
      const students = await DashboardModel.getStudents(teacherId);

      // Parse student_parent_details to provide father_name/father_phone to frontend
      const formattedStudents = students.map(s => {
        let father_name = null;
        let father_phone = null;
        if (s.student_parent_details) {
          try {
            const parentDetails = typeof s.student_parent_details === 'string'
              ? JSON.parse(s.student_parent_details)
              : s.student_parent_details;
            father_name = parentDetails.father_name;
            father_phone = parentDetails.father_phone;
          } catch (e) {
            console.error('Failed to parse student_parent_details', e);
          }
        }
        return {
          ...s,
          father_name,
          father_phone
        };
      });

      res.status(200).json({
        success: true,
        data: formattedStudents
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get School & Branch Info
  static async getSchoolInfo(req, res) {
    try {
      const schoolId = req.user.school_id;
      const branchId = req.user.branch_id;
      const data = await DashboardModel.getSchoolInfo(schoolId, branchId);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get Academic Years & Sessions
  static async getAcademicYears(req, res) {
    try {
      const schoolId = req.user.school_id;
      const data = await DashboardModel.getAcademicYears(schoolId);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get Classes & Sections
  static async getClassesSections(req, res) {
    try {
      const schoolId = req.user.school_id;
      const data = await DashboardModel.getClassesSections(schoolId);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get Permissions
  static async getPermissions(req, res) {
    try {
      const roleId = req.user.role_id;
      const permissions = await DashboardModel.getPermissions(roleId);
      res.status(200).json({
        success: true,
        data: permissions
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Change Password
  static async changePassword(req, res) {
    try {
      const userId = req.user.user_id;
      const staffId = req.user.id;
      const { newPassword } = req.body;

      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters long'
        });
      }

      await DashboardModel.changePassword(userId, staffId, newPassword);
      res.status(200).json({
        success: true,
        message: 'Password updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = DashboardController;
