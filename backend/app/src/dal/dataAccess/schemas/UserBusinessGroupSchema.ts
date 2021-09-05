import DataAccess = require("./../../dataAccess/DataAccess");
import IUserBusinessGroupModel = require("./../../../model/interfaces/IUserBusinessGroupModel");

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

/**
 * 
 * @class UserBusinessGroupSchema
 */
class UserBusinessGroupSchema {

    static get schema() {
        var schema = mongoose.Schema({
            user_id: {
                type: String,
                required: true
            },
            business_group_id: {
                type: String,
                required: true,
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
var schema = mongooseConnection.model<IUserRoleModel>("UserBusinessGroups", UserBusinessGroupSchema.schema);
export = schema;