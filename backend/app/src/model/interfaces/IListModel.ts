/// <reference path="../../../_all.d.ts" />
import mongoose = require("mongoose");

/**
 * 
 * @interface IListModel
 */
interface IListModel extends mongoose.Document {
    _id?: string,
    name?: string,
    work_space?: any,
    weight?: number,
    visibility?: string,
    description?: string,
    archived?: boolean,
    status?: boolean,
    created_by?: any,
    // items?: any[],
    //helping variables 
    // displaySettings?: boolean,
    listStyle?: string,
    shareEmail: string,
}

export { IListModel };