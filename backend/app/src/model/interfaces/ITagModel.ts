/// <reference path="../../../_all.d.ts" />
import mongoose = require("mongoose");

/**
 * 
 * @interface ITagModel
 */
interface ITagModel extends mongoose.Document {
  _id?: string,
  name: string,
  data_type: string,
  description?: string,
  status: boolean
}

export = ITagModel;