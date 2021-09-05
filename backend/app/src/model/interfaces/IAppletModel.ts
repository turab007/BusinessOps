/// <reference path="../../../_all.d.ts" />
import mongoose = require("mongoose");

/**
 * 
 * @interface IAppletModel
 */
interface IAppletModel extends mongoose.Document {
  name: string,
  description?: string,
  status: boolean,
  weight?: number,
  module_type?: string,
  work_spaces?: any[]
}

export = IAppletModel;