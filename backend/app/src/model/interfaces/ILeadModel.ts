/// <reference path="../../../_all.d.ts" />
import mongoose = require("mongoose");

interface ILeadModel extends mongoose.Document {
  name: string,
  description?: number,
  state?: string,
  business_group?: string,
  address1?: string,
  address2?: string,
  address_city?: string,
  address_zip?: string,
  address_state?: string,
  address_country?: string,
  contact_name?: string,
  contact_id_title?:string,
  contact_id?: string,
  contact_type?: string,
  designation?: string,
  company_name?: string,
  company_id?: string,
  company_type?: string,
  time_zone?: string,
  status: string,
  contact_modes:any[any],
  is_active:boolean,
  intersted_in?:any[],
  participants?:any[],
  relatedContact?: Object, // only used as read-only relation
  relatedTechnologies?: Object // only used as read-only relation
  relatedParticipants?: Object // only used as read-only relation
}

export = ILeadModel;