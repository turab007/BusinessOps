/// <reference path="../../../_all.d.ts" />
import mongoose = require("mongoose");

/**
 * 
 * @interface IModuleModel
 */
interface IModuleModel extends mongoose.Document {
  name: string,
  description?: string,
  status: boolean,
  weight?: number,
  module_type?: string,
  work_spaces?: any[]
}

export = IModuleModel;