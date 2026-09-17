const PermissionModel = require('../../model/school-admin/permissionModel');

class PermissionController {
  // Get permissions matrix
  static async getPermissionsMatrix(req, res) {
    try {
      const permissions = await PermissionModel.getPermissionsMatrix();
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

  // Update permission node
  static async updatePermissionNode(req, res) {
    try {
      const nodeId = parseInt(req.params.id, 10);
      const data = req.body;
      const updatedBy = req.user.id;

      await PermissionModel.updatePermissionNode(nodeId, data, updatedBy);
      res.status(200).json({
        success: true,
        message: 'Permission node updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = PermissionController;
