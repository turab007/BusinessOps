/// <reference path="../../../_all.d.ts" />
import mongoose = require("mongoose");

interface IActivityLogModel extends mongoose.Document {
    _id?: string,
    model_changed?: string; // model: task
    document_id: string; // task id
    data_affected: string;
    previous_value?: string;
    new_value?: string;
    action: string; // performed action: deleted, created or updated
    action_by: {
        _id: string,
        name: string
    },
    action_at?: number,
    action_ago?: any,
    action_date?: any,
    previousValue?: any,
    newValue?: any
}

export { IActivityLogModel };