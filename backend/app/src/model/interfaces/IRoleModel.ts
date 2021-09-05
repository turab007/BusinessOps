/// <reference path="../../../_all.d.ts" />
import mongoose = require("mongoose");

/**
 * 
 * @interface IRoleModel
 */
interface IRoleModel extends mongoose.Document {
  _id?: string,
  name: string,
  description?: string,
  status: boolean,
  permissions?: any[],
  work_spaces?: any[]
}

export = IRoleModel;