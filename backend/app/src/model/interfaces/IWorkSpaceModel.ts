/// <reference path="../../../_all.d.ts" />
import mongoose = require("mongoose");

interface IWorkSpaceModel extends mongoose.Document {
  _id?: string,
  name: string,
  description?: string,
  space_type?: string,
  lists_count?: number,
  groups_count?: number,
  users_count?: number,
  bg_color?: string,
  read_only?: boolean,
  is_active?: boolean,
  users?: any[],
  modules?: any[]
  roles?: any[],
  created_by?: any,
  updated_by?: string,

  //TODO MERGE USERS AND USER_ROLE
  user_role?:any[];
  
}

export = IWorkSpaceModel;