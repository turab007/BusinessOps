/// <reference path="../../../_all.d.ts" />
import mongoose = require("mongoose");

/**
 * 
 * @interface IApprovalModel
*/
interface IApprovalModel extends mongoose.Document {
  _id?: string,
  work_space?: any,
  name?: string,
  description?: string,
  comment?: any,
  weight?: number,
  status?: string,
  assign_to_workspace?: any,
  assign_to?:any
  // assign_to_user?:any,
  due_date?: String,
  attachments?: any[],
  comments?: any[],
  created_by?: any,
  //virtual attributes
  createdAgo?: any,
  createdDate?: any,
}

export { IApprovalModel };