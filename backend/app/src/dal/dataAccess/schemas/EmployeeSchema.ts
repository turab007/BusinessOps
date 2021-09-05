import DataAccess = require("./../../dataAccess/DataAccess");
import ta = require('time-ago');
import moment = require('moment');
import IEmployeeModel = require("./../../../model/interfaces/IEmployeeModel");

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;



class EmployeeSchema {
    static get schema() {

        var schema = mongoose.Schema({
            user:
            {
                type: String,
                ref: 'Useres',
                required: true,
                unique: true
            },
            job_title: {
                value: {
                    type: String,
                },
                hidden: {
                    type: Boolean,
                }
            },
            github_token: {
                value: {
                    type: String
                },
                hidden: {
                    type: Boolean
                }
            },
            gitlab_token: {
                id: {
                    type: String
                },
                value: {
                    type: String
                },
                hidden: {
                    type: Boolean
                }
            },
            contact_no:
            {
                value: {
                    type: String
                },
                hidden: {
                    type: Boolean
                }
            },
            address: {
                value: {
                    type: String
                },
                hidden: {
                    type: Boolean
                }

            },
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
                ref: 'Useres'
            }
        })
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
            return t.ago(new Date(this.created_at - 1000));
        })

        return schema;
    }
}

var schema = mongooseConnection.model<IEmployeeModel>("Employee", EmployeeSchema.schema);
export = schema