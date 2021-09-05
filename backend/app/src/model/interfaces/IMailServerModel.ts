/// <reference path="../../../_all.d.ts" />
import mongoose = require("mongoose");

/**
 * 
 * @interface IMailServerModel
 */
interface IMailServerModel extends mongoose.Document {
  _id?: string,
  host?: string,
  port?: string,
  title?: string,
  user_name: string,
  password: string,
  is_gmail: boolean
  description?: string
}

export = IMailServerModel;