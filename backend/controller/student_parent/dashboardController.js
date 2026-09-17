const DashboardModel = require('../../model/student_parent/dashboardModel');

class DashboardController {
  /**
   * Helper: Resolves student context based on authenticated user and optional query param
   */
  static async resolveContext(req) {
    const roleId = req.user.role_id;
    const userId = req.user.user_id;
    const profileId = req.user.id; // student_id for student, parent_id for parent

    if (roleId === 4) {
      // Direct student
      const student = await DashboardModel.getStudentContext(profileId);
      return {
        roleId,
        userId,
        studentId: profileId,
        parentId: null,
        batchId: student?.batch_id || req.user.batch_id || null,
        schoolId: student?.school_id || req.user.school_id || null
      };
    } else if (roleId === 5) {
      // Parent: check for requested student_id or default to first child
      const children = await DashboardModel.getChildrenForParent(profileId);
      let selectedChild = null;

      if (req.query.student_id) {
        const requestedId = parseInt(req.query.student_id);
        selectedChild = children.find(c => c.student_id === requestedId);
      }

      if (!selectedChild && children.length > 0) {
        selectedChild = children[0];
      }

      return {
        roleId,
        userId,
        parentId: profileId,
        studentId: selectedChild ? selectedChild.student_id : null,
        batchId: selectedChild ? selectedChild.batch_id : null,
        schoolId: selectedChild ? selectedChild.school_id : req.user.school_id || null,
        children
      };
    }

    throw new Error('Unauthorized role context');
  }

  /**
   * GET /api/student-parent/dashboard/children
   * (Available for parents to list all wards)
   */
  static async getChildren(req, res) {
    try {
      const roleId = req.user.role_id;
      const parentId = req.user.id;

      if (roleId !== 5) {
        return res.status(200).json({ success: true, data: [] });
      }

      const children = await DashboardModel.getChildrenForParent(parentId);
      res.status(200).json({ success: true, data: children });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * GET /api/student-parent/dashboard/summary
   */
  static async getSummary(req, res) {
    try {
      const ctx = await DashboardController.resolveContext(req);

      if (!ctx.studentId) {
        return res.status(200).json({
          success: true,
          data: {
            student: null,
            classmatesCount: 0,
            classmatesPreview: [],
            children: ctx.children || [],
            message: 'No student enrolled/linked'
          }
        });
      }

      const summary = await DashboardModel.getSummary(ctx.studentId, ctx.roleId, ctx.parentId);
      res.status(200).json({ success: true, data: summary });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * GET /api/student-parent/dashboard/profile
   */
  static async getProfile(req, res) {
    try {
      const ctx = await DashboardController.resolveContext(req);

      if (!ctx.studentId) {
        return res.status(200).json({ success: true, data: null, message: 'No student record found' });
      }

      const profile = await DashboardModel.getFullProfile(ctx.studentId);
      res.status(200).json({ success: true, data: profile });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * GET /api/student-parent/dashboard/schedule
   */
  static async getSchedule(req, res) {
    try {
      const ctx = await DashboardController.resolveContext(req);

      if (!ctx.batchId) {
        return res.status(200).json({
          success: true,
          data: { batch: null, classmates: [] },
          message: 'No batch assigned to student'
        });
      }

      const schedule = await DashboardModel.getClassSchedule(ctx.batchId, ctx.studentId);
      res.status(200).json({ success: true, data: schedule });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * GET /api/student-parent/dashboard/teachers
   */
  static async getTeachers(req, res) {
    try {
      const ctx = await DashboardController.resolveContext(req);

      const teachers = await DashboardModel.getTeachers(ctx.batchId, ctx.schoolId, req.user.branch_id);
      res.status(200).json({ success: true, data: teachers });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * GET /api/student-parent/dashboard/academics
   */
  static async getAcademics(req, res) {
    try {
      const ctx = await DashboardController.resolveContext(req);

      const academics = await DashboardModel.getAcademics(ctx.schoolId);
      res.status(200).json({ success: true, data: academics });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * GET /api/student-parent/dashboard/documents
   */
  static async getDocuments(req, res) {
    try {
      const ctx = await DashboardController.resolveContext(req);

      if (!ctx.studentId) {
        return res.status(200).json({ success: true, data: [] });
      }

      const docs = await DashboardModel.getDocuments(ctx.studentId);
      res.status(200).json({ success: true, data: docs });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * POST /api/student-parent/dashboard/documents
   */
  static async saveDocuments(req, res) {
    try {
      const ctx = await DashboardController.resolveContext(req);

      if (!ctx.studentId) {
        return res.status(400).json({ success: false, message: 'Student ID required' });
      }

      const { documents } = req.body;
      if (!Array.isArray(documents)) {
        return res.status(400).json({ success: false, message: 'Documents must be an array' });
      }

      const updated = await DashboardModel.saveDocuments(ctx.studentId, documents);
      res.status(200).json({ success: true, data: updated, message: 'Documents updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * GET /api/student-parent/dashboard/school-info
   */
  static async getSchoolInfo(req, res) {
    try {
      const ctx = await DashboardController.resolveContext(req);

      const schoolInfo = await DashboardModel.getSchoolInfo(ctx.schoolId, req.user.branch_id);
      res.status(200).json({ success: true, data: schoolInfo });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * GET /api/student-parent/dashboard/login-history
   */
  static async getLoginHistory(req, res) {
    try {
      const userId = req.user.user_id;
      const history = await DashboardModel.getLoginHistory(userId);
      res.status(200).json({ success: true, data: history });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * POST /api/student-parent/dashboard/change-password
   */
  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.user_id;
      const profileId = req.user.id;
      const roleId = req.user.role_id;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Current and new password are required' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
      }

      await DashboardModel.changePassword(userId, profileId, roleId, currentPassword, newPassword);
      res.status(200).json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = DashboardController;
