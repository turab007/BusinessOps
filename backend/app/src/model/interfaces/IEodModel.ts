/// <reference path="../../../_all.d.ts" />
import mongoose = require("mongoose");

export interface IEodModel extends mongoose.Document {
    _id?: string,
    report: string,
    date: string,
    work_space?: any,

    created_at: number,
    updated_at: number,
    created_by?: any,
    updated_by?: any,
    //virtual attributes
    createdAgo?: any,

}