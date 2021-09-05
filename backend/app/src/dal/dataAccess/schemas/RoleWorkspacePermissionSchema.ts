import DataAccess = require("./../../dataAccess/DataAccess");
import IRoleWorkspacePermissionModel = require("./../../../model/interfaces/IRoleWorkspacePermission");

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

/**
 * 
 * @class RoleWorkspacePermissionSchema
 */
class RoleWorkspacePermissionSchema {

    static get schema() {
        var schema = mongoose.Schema({
            module_id: {
                type: String,
                required: true,
            },
            role_id: {
                type: String,
                required: true
            },
            permission_id: {
                type: String,
                required: true,
            },
            workspace_id:{
                type:String,
                required:true
            },
            permission_name: {
                type: String,
                required: false,
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
var schema = mongooseConnection.model<IRoleWorkspacePermissionModel>("RoleWorkspacePermissions", RoleWorkspacePermissionSchema.schema);
export = schema;