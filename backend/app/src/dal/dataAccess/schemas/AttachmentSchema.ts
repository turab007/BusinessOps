import DataAccess = require("./../../dataAccess/DataAccess");
import ta = require('time-ago');
import moment = require('moment');

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;



class AttachmentSchema {
    static get schema() {

        var schema = mongoose.Schema({
            originalname: {
                type: String,
            },
            filename: {
                type: String,
            },
            path: {
                type: String,
            },
            destination: {
                type: String,
            },
            encoding: {
                type: String
            },
            mimetype: {
                type: String
            },
            size: {
                type: String
            },
            created_at: {
                type: Number
            },
            created_by: {
                type: String,
                ref: 'Useres'
            }
        });

        schema.pre('save', function (next) {
            // get the current date unix_timestamp
            var timeStamp = Math.round(+new Date());

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

        return schema;
    }
}

var schema = mongooseConnection.model("Attachments", AttachmentSchema.schema);
export = schema