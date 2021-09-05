/// <reference path="../../../_all.d.ts" />
import mongoose = require("mongoose");

/**
 * 
 * @interface IAttachmentModel
 */
interface IAttachmentModel extends mongoose.Document {
  _id?: string,
  originalname: string,
  filename: string,
  path: string,
  created_by?: any
  created_at?: number,
  size: number,
  destination: string,
  encoding: string,
  mimetype: string,
  //virtual attributes
  createdAgo?: any,
}




export { IAttachmentModel };