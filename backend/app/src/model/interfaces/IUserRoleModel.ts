/// <reference path="../../../_all.d.ts" />
import mongoose = require("mongoose");

/**
 * 
 * @interface IUserRoleModel
 */
interface IUserRoleModel extends mongoose.Document {
  user_id: string,
  role_id: string
}

export = IUserRoleModel;