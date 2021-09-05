/// <reference path="../../../_all.d.ts" />
import mongoose = require("mongoose");

/**
 * 
 * @interface IPermissionModel
 */
interface IPermissionModel extends mongoose.Document {
  module_id: string,
  title: string,
  controller: string,
  action: string,
  description?: string,
  weight?: number
}

export = IPermissionModel;