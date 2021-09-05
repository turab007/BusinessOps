/// <reference path="../../../_all.d.ts" />
import mongoose = require("mongoose");

/**
 * 
 * @interface ITaskGroupModel
*/
interface ITaskGroupModel extends mongoose.Document {
  _id?: string,
  name?: string,
  description?: string,
  work_space?:any,
  weight?: number,
  status?: boolean,
  created_by?: any,
  tasks?: any[]
}

export { ITaskGroupModel };