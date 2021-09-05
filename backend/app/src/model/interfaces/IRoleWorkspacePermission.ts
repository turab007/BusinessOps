/// <reference path="../../../_all.d.ts" />
import mongoose = require("mongoose");

/**
 * 
 * @interface IRoleWorkspacePermissionModel
 */
interface IRoleWorkspacePermissionModel extends mongoose.Document {
  module_id: string,
  role_id: string,
  permission_id: string,
  permission_name?: string
  workspace_id: string
}

export = IRoleWorkspacePermissionModel;