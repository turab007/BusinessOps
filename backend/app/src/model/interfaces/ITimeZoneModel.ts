/// <reference path="../../../_all.d.ts" />
import mongoose = require("mongoose");

/**
 * 
 * @interface ITimeZoneModel
 */
interface ITimeZoneModel extends mongoose.Document {
    _id?: string,
    name: string,
    abbr: string,
    isdst?: boolean,
    offset?: number,
    description?: string,
    utc?: any[]
}

export = ITimeZoneModel;