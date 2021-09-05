/// <reference path="../../../_all.d.ts" />
import mongoose = require("mongoose");

interface IUserModel extends mongoose.Document {
  _id?: string,
  first_name?: string,
  last_name?: string,
  user_id?: string,
  auth_key?: string,
  password_hash?: string,
  password_reset_token?: string,
  activation_token?: string,
  status?: boolean,
  //TODO:low: Remove it.. Its only for demo
  is_admin?: boolean,
  is_employee?: boolean,
  emp_jobTtile?: string,
  // These are non db fields
  email_receieved?: {
    type: boolean,
    default: false
  }

  old_password?: string,
  new_password?: string,
  confirm_new_password?: string,

  //virtual attributes
  fullname?: string,
  initials?: string,

  //relational attributes
  roles?: any[],
  businessGroups?: any[],
  work_spaces?: any[],


}

export = IUserModel;