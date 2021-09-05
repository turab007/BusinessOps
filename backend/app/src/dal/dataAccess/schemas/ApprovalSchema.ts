import DataAccess = require("./../../dataAccess/DataAccess");
import ta = require('time-ago');
import moment = require('moment');


import { IApprovalModel } from "./../../../model/interfaces/barrel/";
import AttachmentSchema = require("./../../dataAccess/schemas/AttachmentSchema");
import CommentSchema = require("./../../dataAccess/schemas/CommentSchema");
import ActivityLogSchema = require("./ActivityLogSchema");


var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

var commentSchema = CommentSchema.schema;
var attachmentSchema = AttachmentSchema.schema;

/**
 * 
 * @class ApprovalSchema
*/
class ApprovalSchema {

    static get schema() {
        var schema = mongoose.Schema({
            name: {
                type: String,
                required: true
            },
            work_space: {
                type: String,
                required: true,
                ref: 'WorkSpaces'
            },
            description: {
                type: String,
                required: false
            },
            comment: {
                type: String,
                required: false
            },
            weight: {
                type: Number,
                required: false,
                default: 1,
            },

            status: {
                type: String,
                enum: ['Pending', 'Approved', 'Rejected', 'Expired'],
                default: "Pending"
            },
            due_date: {
                type: String
            },
            assign_to_workspace: {
                type: String,
                ref: 'WorkSpaces',
                required:false
            },
            assign_to_user: {
                type: String,
                ref: 'Useres',
                required:false
            },
            // assign_to_user: {
            //     type: String,
            //     ref: 'Useres',
            //     required:false
            // },
            attachments: [
                attachmentSchema,
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
            ActivityLogSchema.remove({ model_changed: 'approval', document_id: this._id }).exec();
            next();
        });

        //TODO:low: There should be some inherited/central/common method for following pre method(s).
        schema.pre('save', function (next) {
            // get the current date unix_timestamp
            var timeStamp = Math.round(+new Date());

            // change the updated_at field to current date
            this.updated_at = timeStamp;

            // if created_at doesn't exist, add to tha596ef4b87774f7182386707et field
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
var schema = mongooseConnection.model<IApprovalModel>("Approvals", ApprovalSchema.schema);
export = schema; 