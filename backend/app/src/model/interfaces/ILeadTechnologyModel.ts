/// <reference path="../../../_all.d.ts" />
import mongoose = require("mongoose");

/**
 * 
 * @interface ILeadTechnologyModel
 */
interface ILeadTechnologyModel extends mongoose.Document {
  _id?: string,
  lead_id: string,
  tag_id: string, //Interests or technology
}

export = ILeadTechnologyModel;