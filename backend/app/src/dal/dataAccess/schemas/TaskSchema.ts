import DataAccess = require("./../../dataAccess/DataAccess");
import ta = require('time-ago');
import moment = require('moment');


import { ITaskModel } from "./../../../model/interfaces/barrel/";
import CommentSchema = require("./../../dataAccess/schemas/CommentSchema");
import AttachmentSchema = require("./../../dataAccess/schemas/AttachmentSchema");
import ActivityLogSchema = require("./ActivityLogSchema");

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

var commentSchema = CommentSchema.schema;
var attachmentSchema = AttachmentSchema.schema;


/**
 * 
 * @class TaskSchema
*/
class TaskSchema {

    static get schema() {
        var schema = mongoose.Schema({
            name: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: false
            },
            weight: {
                type: Number,
                required: false,
                default: 1,
            },
            task_group_id: {
                type: String,
                required: true,
                ref: 'TaskGroups'
            },
            status: {
                type: String
            },
            priority: {
                type: String
            },
            due_date: {
                type: String
            },
            start_date: {
                type: String
            },
            assigned_to: {
                type: String,
                ref: 'Useres'
            },
            attachments: [
                attachmentSchema
            ],
            comments: [
                commentSchema,
            ],
            created_at: {
                type: Number,
                required: false
            },
            updated_at: {
                type: Number,
                required: false
            },
            created_by: {
                type: String,
                ref: 'Useres'
            },
            updated_by: {
                type: String,
            }
        });

        schema.pre('remove', function (next) {
            ActivityLogSchema.remove({ model_changed: 'task', document_id: this._id }).exec();
            next();
        });

        //TODO:low: There should be some inherited/central/common method for following pre method(s).
        schema.pre('save', function (next) {
            // get the current date unix_timestamp
            var timeStamp = Math.round(+new Date());

            // change the updated_at field to current date
            this.updated_at = timeStamp;

            // if created_at doesn't exist, add to that field
            if (!this.created_at)
                this.created_at = timeStamp;

            next();
        });
        /**
        * setting virtual elements
        */
        schema.set('toJSON', {
            virtuals: true
        });
        schema.virtual('createdAgo').get(function () {
            let t = ta();
            // return t.ago(new Date() );
            return t.ago(new Date(this.created_at - 1000));
        })
        schema.virtual('createdDate').get(function () {
            return moment(this.created_at).format("MMMM, d Y");
        })

        return schema;
    }
}
var schema = mongooseConnection.model<ITaskModel>("Tasks", TaskSchema.schema);
export = schema; 