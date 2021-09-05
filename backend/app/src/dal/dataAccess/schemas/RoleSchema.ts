import DataAccess = require("./../../dataAccess/DataAccess");
import IRoleModel = require("./../../../model/interfaces/IRoleModel");

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

/**
 * 
 * @class RoleSchema
 */
class RoleSchema {

    static get schema() {
        var schema = mongoose.Schema({
            name: {
                type: String,
                required: true,
                unique: true
            },
            description: {
                type: String,
                required: false
            },
            status: {
                type: Boolean,
                required: true,
                default: true
            },
            work_spaces: [{ type: mongoose.Schema.ObjectId, ref: 'WorkSpaces' }], // (workspaces)
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
                required: false
            },
            updated_by: {
                type: String,
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

        schema.pre('remove', function (next) {
            let roleModel = this;
            if (this.work_spaces) {

                roleModel.model('WorkSpaces').update(
                    { roles: roleModel._id },
                    { $pull: { roles: roleModel._id } },
                    { multi: true },
                    next);
            }

            else {
                next()
            }

        });


        return schema;
    }
}
var schema = mongooseConnection.model<IRoleModel>("Roles", RoleSchema.schema);
export = schema;