import DataAccess = require("./../../dataAccess/DataAccess");
import ITagModel = require("./../../../model/interfaces/ITagModel");

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

/**
 * 
 * @class TagSchema
 */
class TagSchema {

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
            data_type: {
                type: String,
                required: true
            },
            status: {
                type: Boolean,
                required: true,
                default: true
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
var schema = mongooseConnection.model<ITagModel>("Tags", TagSchema.schema);
export = schema;