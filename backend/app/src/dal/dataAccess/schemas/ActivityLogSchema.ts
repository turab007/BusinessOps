import uniqueValidator = require('mongoose-unique-validator');
import ta = require('time-ago');
import moment = require('moment');

import DataAccess = require("./../../dataAccess/DataAccess");
import { IActivityLogModel } from "./../../../model/interfaces/barrel";

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

class ActivityLogSchema {

    static get schema() {
        var schema = mongoose.Schema({
            model_changed: {
                type: String,
                required: true,
                enum: ['task', 'list', 'approval', 'eod'],
                default: 'task'
            },
            document_id: {
                type: String,
                required: true
            },
            data_affected: {
                type: String,
                required: true
            },
            previous_value: {
                type: String,
                required: false

            },
            new_value: {
                type: String,
                required: false
            },
            action: {
                type: String,
                required: true,
                enum: ['add', 'update', 'delete'],
            },
            action_by: {
                _id: {
                    type: String,
                    required: true,
                    ref: 'Useres'
                },
                name: {
                    type: String,
                    required: true
                },
            },
            action_at: {
                type: Number
            }
        });

        schema.pre('save', function (next) {
            // get the current date unix_timestamp
            var timeStamp = Math.round(+new Date());

            // change the updated_at field to current date
            this.action_at = timeStamp;

            next();
        });

        /**
            * setting virtual elements
        */
        schema.set('toJSON', {
            virtuals: true
        });
        schema.virtual('action_ago').get(function () {
            let t = ta();
            // return t.ago(new Date() );
            return t.ago(new Date(this.action_at - 1000));
        })
        schema.virtual('action_date').get(function () {
            return moment(this.action_at).format("MMMM, d Y");
        })

        schema.virtual('previousValue').get(function () {
            if (this.data_affected.search('date') != -1) {
                return moment(this.previous_value).format("MMMM, DD YYYY")
            }
            return this.previous_value;
        })
        schema.virtual('newValue').get(function () {
            if (this.data_affected.search('date') != -1) {
                return moment(this.new_value).format('MMMM, DD YYYY')
                // YYYY-MM-DD
            }
            return this.new_value;
        })

        return schema;
    }
}

var schema = mongooseConnection.model<IActivityLogModel>("activitylog", ActivityLogSchema.schema);

export = schema;
