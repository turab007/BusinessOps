/// <reference path="../../../_all.d.ts" />
import mongoose = require("mongoose");

/**
 * 
 * @interface IStatusFlowModel
 */
interface IStatusFlowModel extends mongoose.Document {
    _id?: string,
    business_group_id?:string,
    type?:string,
    name: string,
    weight?:number,
    status?: boolean,
    description?: string
}

export = IStatusFlowModel;