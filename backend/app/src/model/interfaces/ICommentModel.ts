/// <reference path="../../../_all.d.ts" />
import mongoose = require("mongoose");

/**
 * 
 * @interface ICommentModel
 */
interface ICommentModel extends mongoose.Document {
  _id?: string,
  comment?: string,
  approved?: boolean,
  created_by?: any
  //virtual attributes
  createdAgo?:any,
  createdDate?:any,
}

export { ICommentModel };