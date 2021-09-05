/// <reference path="../../../_all.d.ts" />
import mongoose = require("mongoose");

/**
 * 
 * @interface IListItemModel
 */
interface IListItemModel extends mongoose.Document {
    _id?: string,
    name?: string,
    weight?:number,
    list_id?: any,
    description?: string,
    done?: boolean
    created_by?: any
}

export { IListItemModel };