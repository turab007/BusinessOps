/// <reference path="../../../_all.d.ts" />
import mongoose = require("mongoose");

/**
 * 
 * @interface ITaskModel
*/
interface ITaskModel extends mongoose.Document {
  _id?: string,
  name?: string,
  description?: string,
  task_group_id?: any,
  weight?: number,
  status?: string,
  priority?: string,
  due_date?: any,
  start_date?: any,
  assigned_to?: any,
  comments?: any[],
  created_by?: any,
  //virtual attributes
  displaySettings?: boolean
  attachments?: any
  createdAgo?: any,
  createdDate?: any
}

export { ITaskModel };