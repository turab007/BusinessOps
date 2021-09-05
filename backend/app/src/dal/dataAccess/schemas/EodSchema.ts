import DataAccess = require("./../../dataAccess/DataAccess");
import ta = require('time-ago');
import moment = require('moment');
import IEodModel = require("./../../../model/interfaces/IEodModel");

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;



class EodSchema {
    static get schema() {

        var schema = mongoose.Schema({
            report: {
                type: String,
                required: true,
            },
            date: {
                type: String,
                required: true
            },
            work_space: {
                type: String,
                required: true,
                ref: 'WorkSpaces'
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

var schema = mongooseConnection.model<IEodModel>("EodReport", EodSchema.schema);
export = schema