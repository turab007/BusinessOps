import DataAccess = require("./../../dataAccess/DataAccess");
import ITimeZoneModel = require("./../../../model/interfaces/ITimeZoneModel");

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

/**
 * 
 * @class TimeZoneSchema
 */
class TimeZoneSchema {

    static get schema() {
        var schema = mongoose.Schema({
            name: {
                type: String,
                required: true,
                unique: true
            },
            abbr: {
                type: String,
                required: false
            },
            offset: {
                type: Number,
                required: false
            },
            isdst: {
                type: Boolean,
                required: false,
                default: false
            },
            description: {
                type: String,
                required: true,
                default: false
            },
            utc: {
                type: Array,
                required: false,
                default: []
            },
            created_at: {
                type: Number,
                required: false
            },
            updated_at: {
                type: Number,
                required: false
            }
        });

        //TODO:low: There should be some inherited/central/common method for following pre method(s).
        schema.pre('save', function (next) {
            // get the current date unix_timestamp
            var timeStamp = Math.round(+new Date() / 1000);

            // change the updated_at field to current date
            this.updated_at = timeStamp;

            // if created_at doesn't exist, add to that field
            if (!this.created_at)
                this.created_at = timeStamp;

            next();
        });

        return schema;
    }
}
var schema = mongooseConnection.model<ITagModel>("TimeZones", TimeZoneSchema.schema);
export = schema;