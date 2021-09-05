/// <reference path="../../../_all.d.ts" />
import mongoose = require("mongoose");

/**
 * 
 * @interface IUserBusinessGroupModel 
 */
interface IUserBusinessGroupModel  extends mongoose.Document {
  user_id: string,
  business_group_id: string
}

export = IUserBusinessGroupModel;