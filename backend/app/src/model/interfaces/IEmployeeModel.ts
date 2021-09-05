/// <reference path="../../../_all.d.ts" />
import mongoose = require("mongoose");

export interface IEmployeeModel extends mongoose.Document {
    _id?: string,
    user:string,
    contact_no?:object,
    addresss?:object,
    job_title?:object,
    github_token:object,
    gitlab_token:object,

    created_at: number,
    updated_at: number,
    created_by?: any,
    updated_by?: any,
    //virtual attributes
    createdAgo?: any,

}