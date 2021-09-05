/// <reference path="../../../_all.d.ts" />
import mongoose = require("mongoose");

interface IContactModel extends mongoose.Document {
    _id?: string,
    first_name: string,
    last_name?: number,
    account: string,
    company?: string,
    company_title?: string,
    email: string,
    phone?: string,
    mobile?: string,
    fax?: string,
    skype_id?: string,
    website?: string,
    mailing_street?: string,
    city?: string,
    state?: string,
    zip?: string,
    country?: string,
    description?: string,
    related_leads?: any[],
}

export = IContactModel;