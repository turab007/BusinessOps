/// <reference path="../../../_all.d.ts" />
import mongoose = require("mongoose");

/**
 * 
 * @interface IPermissionChildrenModel
 */
interface IPermissionChildrenModel extends mongoose.Document {
  parent_id: string,
  child_id: string,
  parent_permission: string,
  child_permission: string
}

export = IPermissionChildrenModel;