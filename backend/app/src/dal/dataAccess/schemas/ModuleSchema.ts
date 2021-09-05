import DataAccess = require("./../../dataAccess/DataAccess");
import IModuleModel = require("./../../../model/interfaces/IModuleModel");

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

/**
 *  It is going to be used as applet or module
 * @class ModuleSchema
 */
class ModuleSchema {

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
                required: true
            },
            weight: {
                type: Number,
                required: false
            },
            module_type: {
                type: String,
                required: false,
                enum: ['Module', 'Applet'],
                default: 'Module'
            },
            work_spaces: [{ type: mongoose.Schema.ObjectId, ref: 'WorkSpaces', required: false, }], // (modules or applets)
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
            let moduleModel = this;
            if (this.work_spaces) {

                moduleModel.model('WorkSpaces').update(
                    { modules: moduleModel._id },
                    { $pull: { modules: moduleModel._id } },
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
var schema = mongooseConnection.model<IModuleModel>("Modules", ModuleSchema.schema);
export = schema;