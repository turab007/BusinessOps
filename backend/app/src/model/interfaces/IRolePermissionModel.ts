/// <reference path="../../../_all.d.ts" />
import mongoose = require("mongoose");

/**
 * 
 * @interface IRolePermissionModel
 */
interface IRolePermissionModel extends mongoose.Document {
  module_id: string,
  role_id: string,
  permission_id: string,
  permission_name?: string
}

export = IRolePermissionModel;