/// <reference path="../../../_all.d.ts" />
import mongoose = require("mongoose");

interface ICompanyModel extends mongoose.Document {
    _id?: string,
    name: string,
    address?: number,
    city?: string,
    zip?: string,
    state?: string,
    country?: string,
    email?: string,
    phone?: string,
    mobile?: string,
    fax?: string,
    website?: string,
    description?: string,
    related_contacts?: any[],
}

export = ICompanyModel;