import DataAccess = require("./../../dataAccess/DataAccess");
import { ITaskGroupModel } from "./../../../model/interfaces/barrel/";

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;


/**
 * 
 * @class TaskGroupSchema
*/
class TaskGroupSchema {

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
                default: 1,
            },
            work_space: {
                type: String,
                required: true,
                ref: 'WorkSpaces'
            },
            status: {
                type: Boolean,
                default: true
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

            // if created_at doesn't exist, add to tha596ef4b87774f7182386707et field
            if (!this.created_at)
                this.created_at = timeStamp;

                

            next();
        });
        schema.set('toJSON', {
            virtuals: true
        });
        schema.virtual('tasks', {
            ref: 'Tasks', // The model to use
            localField: '_id', // Find people where `localField`
            foreignField: 'task_group_id', // is equal to `foreignField`
            // If `justOne` is true, 'members' will be a single doc as opposed to
            // an array. `justOne` is false by default.
            justOne: false
        });

        return schema;
    }
}
var schema = mongooseConnection.model<ITaskGroupModel>("TaskGroups", TaskGroupSchema.schema);
export = schema; 