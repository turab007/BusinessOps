import DataAccess = require("./../../dataAccess/DataAccess");
import { IListItemModel } from "./../../../model/interfaces/barrel/";

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

/**
 * 
 * @class ListItemSchema
 */
class ListItemSchema {

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
                default: 0,
            },
            list_id: {
                type: String,
                ref: 'Lists',
                required: true
            },
            done: {
                type: Boolean,
                required: false,
                default: false
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
var schema = mongooseConnection.model<IListItemModel>("ListItems", ListItemSchema.schema);
export = schema;